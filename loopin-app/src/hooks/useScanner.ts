import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import type { ConnectionCard } from '../types';

// ---------------------------------------------------------------------------
// Lean QR payload shape — matches exactly what QRBadge.tsx encodes.
// The full QRPayload type (with displayName, avatar, socials …) is the
// in-memory copy/share token; only these 4 fields live in the QR modules.
// ---------------------------------------------------------------------------
export interface ScannedQRToken {
  /** Internal user reference ID — opaque, no PII */
  userId: string;
  /** Event this badge was issued under */
  eventId: string;
  /** Epoch ms of badge generation — used for time-bound validity checks */
  timestamp: number;
  /** Placeholder for future HMAC/JWT signature (Phase 2) */
  sig?: string;
  
  // Optional profile fields embedded directly into QR for MVP (no backend)
  fullName?: string;
  roleTitle?: string;
  pitch?: string;
}

/** Camera permission states for the web scanner */
export type CameraPermission = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export const useScanner = () => {
  const isNative = Capacitor.isNativePlatform();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<CameraPermission>('idle');

  /**
   * Parses a raw QR string into a ScannedQRToken.
   *
   * Accepts both the lean opaque format `{ userId, eventId, timestamp, sig }`
   * produced by QRBadge.tsx and (for backwards-compat) any superset that also
   * carries `userId` — so old full-payload QRs still parse without crashing.
   *
   * @param raw - Raw decoded string from the QR scanner
   * @returns Parsed token or null if the payload is invalid / non-Genesis
   */
  const parseQRToken = (raw: string): ScannedQRToken | null => {
    try {
      const data = JSON.parse(raw);
      // Minimum required fields for a valid Genesis QR token
      if (
        data &&
        typeof data.userId === 'string' &&
        data.userId.length > 0 &&
        typeof data.eventId === 'string' &&
        data.eventId.length > 0 &&
        typeof data.timestamp === 'number'
      ) {
        return {
          userId: data.userId,
          eventId: data.eventId,
          timestamp: data.timestamp,
          sig: data.sig ?? data.signature ?? undefined,
          fullName: typeof data.fullName === 'string' ? data.fullName : undefined,
          roleTitle: typeof data.roleTitle === 'string' ? data.roleTitle : undefined,
          pitch: typeof data.pitch === 'string' ? data.pitch : undefined,
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  /**
   * Builds a minimal ConnectionCard from a scanned QR token.
   *
   * In Phase 2 this will be replaced by a server round-trip that resolves
   * `userId` → full profile. For now we construct a placeholder card so the
   * existing connection flow (PostScanModal notes, connections list) works
   * end-to-end without a backend.
   *
   * @param token        - Parsed QR token
   * @param eventName    - Human-readable event name for the card
   */
  const buildConnectionCardFromToken = (
    token: ScannedQRToken,
    eventName: string,
  ): ConnectionCard => ({
    id: `conn_scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: token.userId,
    // Use embedded token fields if available (MVP), fallback to placeholder
    fullName: token.fullName || `Builder ${token.userId.slice(-5).toUpperCase()}`,
    roleTitle: token.roleTitle || 'Genesis Participant',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(token.fullName || token.userId)}&background=533afd&color=fff&size=150`,
    pitch: token.pitch || 'Scanned via QR Badge — profile details load after server lookup.',
    eventId: token.eventId,
    eventName,
    timestamp: new Date(token.timestamp).toISOString(),
    tags: ['#QRScanned'],
    privateNote: '',
    socialLinks: {},
  });

  /**
   * Request camera permission via the browser's getUserMedia API.
   * Updates `cameraPermission` state; resolves to true if granted.
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraPermission('unavailable');
      setError('Camera API not available in this browser / context.');
      return false;
    }
    setCameraPermission('requesting');
    try {
      // Probe for back camera; stop the stream immediately — html5-qrcode
      // will manage its own stream when it starts.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      stream.getTracks().forEach((t) => t.stop());
      setCameraPermission('granted');
      return true;
    } catch (err) {
      const name = err instanceof Error ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setCameraPermission('denied');
        setError('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else {
        setCameraPermission('unavailable');
        setError(`Camera unavailable: ${err instanceof Error ? err.message : String(err)}`);
      }
      return false;
    }
  }, []);

  const stopScan = useCallback(async () => {
    setIsScanning(false);
    if (isNative) {
      document.body.classList.remove('barcode-scanner-active');
    }
  }, [isNative]);

  return {
    isNative,
    isScanning,
    setIsScanning,
    error,
    setError,
    cameraPermission,
    setCameraPermission,
    parseQRToken,
    buildConnectionCardFromToken,
    requestCameraPermission,
    stopScan,
  };
};
