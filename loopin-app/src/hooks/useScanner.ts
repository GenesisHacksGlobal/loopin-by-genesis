import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import type { QRPayload } from '../types';

export const useScanner = () => {
  const isNative = Capacitor.isNativePlatform();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parseQRPayload = (raw: string): QRPayload | null => {
    try {
      const data = JSON.parse(raw);
      if (data && data.userId && data.signature) {
        return data as QRPayload;
      }
      return null;
    } catch {
      return null;
    }
  };

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
    parseQRPayload,
    stopScan,
  };
};
