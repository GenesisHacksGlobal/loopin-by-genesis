import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Sparkles, UserCheck, ShieldCheck, CameraOff, Loader2, CheckCircle2 } from 'lucide-react';
import type { ConnectionCard } from '../types';
import { useScanner } from '../hooks/useScanner';
import { useHaptics } from '../hooks/useHaptics';

// Unique DOM element ID used by html5-qrcode to mount the camera preview.
// Must be stable across renders — do NOT use a dynamic suffix.
const QR_READER_ELEMENT_ID = 'loopin-qr-reader';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (card: ConnectionCard) => void;
  currentEventName: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  currentEventName,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'sandbox'>('sandbox');
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);

  const {
    cameraPermission,
    parseQRToken,
    buildConnectionCardFromToken,
    requestCameraPermission,
    error: scannerError,
  } = useScanner();

  const { triggerSuccessHaptic } = useHaptics();

  // Ref to the Html5Qrcode instance — lives outside React state to avoid
  // triggering re-renders on every frame during scanning.
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  // Guard against calling stop() when the scanner was never started.
  const isScannerRunning = useRef<boolean>(false);

  // ---------------------------------------------------------------------------
  // Scanner lifecycle helpers
  // ---------------------------------------------------------------------------

  /**
   * Stops the Html5Qrcode instance and releases the camera stream.
   * Safe to call even if the scanner was never started.
   *
   * Important: `clear()` MUST be called only after `stop()` resolves — calling
   * it while the scan is still active throws "Cannot clear while scan is
   * ongoing". Moving it inside the try block guarantees this ordering.
   */
  const stopCameraScanner = useCallback(async () => {
    if (html5QrRef.current && isScannerRunning.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch {
        // Already stopped or element was removed from DOM — safe to ignore
      }
    }
    isScannerRunning.current = false;
  }, []);

  const handleScanSuccess = useCallback(async (card: ConnectionCard) => {
    // Ensure scanner is stopped if it was running
    await stopCameraScanner();
    
    // Haptic + visual feedback (< 400 ms SLA per features.md §2.2)
    await triggerSuccessHaptic();
    setScanSuccess(true);

    // Slight delay so the success animation is visible before closing
    setTimeout(() => {
      setScanSuccess(false);
      onScanSuccess(card);
      onClose();
    }, 500);
  }, [stopCameraScanner, triggerSuccessHaptic, onScanSuccess, onClose]);



  /**
   * Starts the Html5Qrcode scanner pointed at the back camera.
   * Assumes camera permission has already been granted.
   */
  const startCameraScanner = useCallback(async () => {
    // Make sure any previous instance is fully stopped before creating a new one.
    await stopCameraScanner();

    // The DOM element must exist before we instantiate Html5Qrcode.
    const el = document.getElementById(QR_READER_ELEMENT_ID);
    if (!el) return;

    const scanner = new Html5Qrcode(QR_READER_ELEMENT_ID, { verbose: false });
    html5QrRef.current = scanner;

    try {
      await scanner.start(
        // Prefer back-facing camera; browsers fall back to any camera if env is unavailable
        { facingMode: 'environment' },
        {
          fps: 10,
          // qrbox defines the inner scan region (modules outside it are dimmed).
          // Using a square that fits inside the 240 × 240 px container.
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1.0,
        },
        // ── Success callback ────────────────────────────────────────────────
        async (decodedText) => {
          const token = parseQRToken(decodedText);
          if (!token) {
            // Not a Genesis QR — ignore and let the user retry
            // Stop scanning immediately and restart so they can try again
            await stopCameraScanner();
            setTimeout(() => startCameraScanner(), 1500);
            return;
          }

          // Build the ConnectionCard from the opaque token
          const card = buildConnectionCardFromToken(token, currentEventName);
          await handleScanSuccess(card);
        },
        // ── Error callback (fires on every failed frame — expected, not logged) ──
        (_errorMessage) => {
          // Intentionally silent; every non-QR frame triggers this
        },
      );
      isScannerRunning.current = true;
    } catch (err) {
      console.error('[QRScannerModal] Failed to start camera scanner:', err);
      isScannerRunning.current = false;
    }
  }, [
    stopCameraScanner,
    parseQRToken,
    buildConnectionCardFromToken,
    currentEventName,
    triggerSuccessHaptic,
    onScanSuccess,
    onClose,
  ]);

  // ---------------------------------------------------------------------------
  // Camera tab activation flow
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      // Stop the scanner whenever the modal closes or the user switches away
      stopCameraScanner();
      return;
    }

    // Kick off the permission → start flow
    let cancelled = false;
    (async () => {
      const granted = await requestCameraPermission();
      if (cancelled || !granted) return;
      // Wait one tick so React has committed the QR reader div to the DOM
      requestAnimationFrame(() => {
        if (!cancelled) startCameraScanner();
      });
    })();

    return () => {
      cancelled = true;
      stopCameraScanner();
    };
    // We want this to re-run when the tab or modal open state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, [stopCameraScanner]);

  // ---------------------------------------------------------------------------
  // Early return — don't render at all when closed
  // ---------------------------------------------------------------------------
  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // Mock builder payloads for the Sandbox tab
  // ---------------------------------------------------------------------------
  const mockBuilders: ConnectionCard[] = [
    {
      id: `conn_${Date.now()}_1`,
      userId: 'usr_sarah_1',
      fullName: 'Sarah Chen',
      roleTitle: 'Senior ZK Cryptographer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      eventId: 'evt_genesis_2026',
      eventName: currentEventName,
      timestamp: new Date().toISOString(),
      pitch: 'Building Circom circuits for private identity on Ethereum. Seeking Rust auditors!',
      tags: ['#ZK-SNARKs', '#Circom', '#Rust', '#FoundingTeammate'],
      socialLinks: {
        github: 'https://github.com/sarahchen-zk',
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://x.com/sarahchen_zk',
      },
      privateNote: 'Met at the ZK research booth. Very interested in co-building indexer.',
    },
    {
      id: `conn_${Date.now()}_2`,
      userId: 'usr_vikram_2',
      fullName: 'Vikram Malhotra',
      roleTitle: 'Solana Infra Engineer & Core Contributor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      eventId: 'evt_genesis_2026',
      eventName: currentEventName,
      timestamp: new Date().toISOString(),
      pitch: 'High-throughput RPC nodes & gRPC streaming services. Looking for Solana founders.',
      tags: ['#Solana', '#gRPC', '#Rust', '#Infrastructure'],
      socialLinks: {
        github: 'https://github.com/vmalhotra-sol',
        twitter: 'https://x.com/vmalhotra_sol',
        portfolio: 'https://vikram.dev',
      },
      privateNote: 'Offered free testnet RPC access for our hackathon project.',
    },
    {
      id: `conn_${Date.now()}_3`,
      userId: 'usr_elena_3',
      fullName: 'Elena Rostova',
      roleTitle: 'AI Research Lead & LLM Specialist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      eventId: 'evt_genesis_2026',
      eventName: currentEventName,
      timestamp: new Date().toISOString(),
      pitch: 'Autonomous AI agents for smart contract fuzzing. Need Web3 frontend dev!',
      tags: ['#AI/ML', '#Python', '#PyTorch', '#SmartContracts'],
      socialLinks: {
        github: 'https://github.com/elena-ai',
        linkedin: 'https://linkedin.com/in/elena-rostova',
      },
      privateNote: 'Pitched joint submission for the AI x Crypto track prize.',
    },
  ];

  // ---------------------------------------------------------------------------
  // Camera tab content — resolved per cameraPermission state
  // ---------------------------------------------------------------------------
  const renderCameraTab = () => {
    // ── Requesting permission spinner ────────────────────────────────────────
    if (cameraPermission === 'requesting') {
      return (
        <div className="h-64 rounded-2xl bg-slate-900 border-2 border-dashed border-[#533afd]/40 flex flex-col items-center justify-center gap-3 text-center p-6">
          <Loader2 className="w-9 h-9 text-[#533afd] animate-spin" />
          <p className="font-body-md text-sm text-slate-300 font-light">
            Requesting camera access…
          </p>
          <p className="font-body-md text-[11px] text-slate-500 font-tabular">
            Allow the browser prompt to activate your camera.
          </p>
        </div>
      );
    }

    // ── Permission denied ────────────────────────────────────────────────────
    if (cameraPermission === 'denied' || cameraPermission === 'unavailable') {
      return (
        <div className="h-64 rounded-2xl bg-slate-900 border-2 border-dashed border-red-500/40 flex flex-col items-center justify-center gap-3 text-center p-6">
          <CameraOff className="w-9 h-9 text-red-400 mx-auto" />
          <div>
            <p className="font-heading-md text-sm text-slate-200 font-light">
              {cameraPermission === 'denied' ? 'Camera Access Denied' : 'Camera Unavailable'}
            </p>
            <p className="font-body-md text-[11px] text-slate-400 mt-1.5 font-tabular max-w-xs">
              {scannerError ??
                'Camera permission is required to scan QR badges. Enable it in your browser settings, then switch back to this tab.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('sandbox')}
            className="btn-secondary-pill text-xs py-1.5 px-4 mt-1"
          >
            Use Simulator Instead
          </button>
        </div>
      );
    }

    // ── Live camera feed (permission granted / idle initial render) ──────────
    // The div with QR_READER_ELEMENT_ID is the mount target for html5-qrcode.
    // It must be present in the DOM before startCameraScanner() is called;
    // the useEffect above schedules the start after the next animation frame.
    return (
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#533afd]/40">
        {/* html5-qrcode mounts its <video> and canvas elements here */}
        <div
          id={QR_READER_ELEMENT_ID}
          className="w-full"
          style={{ minHeight: '240px' }}
        />

        {/* Corner frame overlays — purely decorative, sit above the video */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Top-left */}
          <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#533afd] rounded-tl-md" />
          {/* Top-right */}
          <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#533afd] rounded-tr-md" />
          {/* Bottom-left */}
          <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#533afd] rounded-bl-md" />
          {/* Bottom-right */}
          <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#533afd] rounded-br-md" />
        </div>

        {/* Scanning hint label */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 py-2 px-3 bg-gradient-to-t from-slate-900/90 to-transparent text-center">
          <p className="font-body-md text-[11px] text-slate-400 font-tabular">
            Align a Genesis QR badge inside the frame
          </p>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d253d]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg card-dashboard-mockup relative overflow-hidden space-y-4 shadow-2xl border border-[#e3e8ee]">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#e3e8ee] pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-[#533afd] text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading-md text-base text-[#0d253d] font-normal">QR Scanner Viewfinder</h3>
              <p className="font-body-md text-[11px] text-[#64748d] font-tabular">
                Scope: {currentEventName} • SLA &lt; 400ms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#64748d] hover:text-[#0d253d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Success Global Overlay */}
        {scanSuccess ? (
          <div className="h-64 rounded-2xl bg-emerald-950 border-2 border-emerald-500/60 flex flex-col items-center justify-center gap-3 text-center p-6 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <p className="font-heading-md text-base text-emerald-300 font-light">Badge Scanned!</p>
            <p className="font-body-md text-[11px] text-emerald-600 font-tabular">
              Mutual exchange confirmed · Saving contact…
            </p>
          </div>
        ) : (
          <>
            {/* Tab Switcher: Camera / Web Sandbox */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] font-tabular text-xs">
              <button
                onClick={() => setActiveTab('camera')}
                className={`py-1.5 rounded-full font-medium transition-all ${
                  activeTab === 'camera'
                    ? 'bg-[#533afd] text-white shadow-md'
                    : 'text-[#64748d] hover:text-[#0d253d]'
                }`}
              >
                Native Camera Feed
              </button>
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`py-1.5 rounded-full font-medium transition-all ${
                  activeTab === 'sandbox'
                    ? 'bg-[#533afd] text-white shadow-md'
                    : 'text-[#64748d] hover:text-[#0d253d]'
                }`}
              >
                Web Simulator Sandbox
              </button>
            </div>

            {/* Camera Tab */}
            {activeTab === 'camera' && renderCameraTab()}

            {/* Web Sandbox Simulator Tab View — UNCHANGED */}
            {activeTab === 'sandbox' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#533afd] font-tabular">
                  <span className="flex items-center gap-1 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
                    Simulate Scanning Active Event Attendees
                  </span>
                  <span className="pill-tag-soft">Sandbox Mode</span>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {mockBuilders.map((builder) => (
                    <div
                      key={builder.id}
                      className="p-3 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#533afd]/60 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={builder.avatar}
                          alt={builder.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-[#533afd]/30"
                        />
                        <div className="min-w-0">
                          <h4 className="font-heading-md text-xs text-[#0d253d] font-semibold truncate">{builder.fullName}</h4>
                          <p className="font-body-md text-[11px] text-[#533afd] truncate">{builder.roleTitle}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleScanSuccess(builder)}
                        className="btn-primary-pill text-xs py-1.5 px-3 flex-shrink-0"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Scan Badge</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#e3e8ee] flex items-center justify-between text-[11px] text-[#64748d] font-tabular">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Opaque Signed Payload • No Raw PII</span>
          </span>
          <span>DPDP Act 2023 Compliant</span>
        </div>
      </div>
    </div>
  );
};
