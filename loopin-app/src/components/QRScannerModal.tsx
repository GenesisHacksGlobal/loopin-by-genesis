import React, { useState, useEffect } from 'react';
import { X, Camera, Flashlight, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';
import type { ConnectionCard, QRPayload } from '../types';
import { useHaptics } from '../hooks/useHaptics';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (connectionCard: ConnectionCard) => void;
  currentEventName: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  currentEventName,
}) => {
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { triggerSuccessHaptic } = useHaptics();

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sample builder payloads for quick desktop/browser testing
  const sampleBuilders = [
    {
      name: 'Sarah Chen',
      role: 'Senior Rust & Smart Contract Dev',
      pitch: 'Building cross-chain ZK verification rollups. Need UI/UX lead.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      socials: { github: 'https://github.com/sarahchen-zk', twitter: 'https://x.com/sarah_zk_rust' },
    },
    {
      name: 'Marcus Brody',
      role: 'AI Lead & Fine-Tuning Specialist',
      pitch: 'Fine-tuning Llama-3 70B models for local browser code synthesis.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      socials: { github: 'https://github.com/marcusbrody-ai', portfolio: 'https://brody.ai' },
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Product Designer & Spatial UI Lead',
      pitch: 'Crafting spatial 3D glassmorphism UIs for Web3 & AI tooling.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      socials: { linkedin: 'https://linkedin.com/in/elena-rostova-design', portfolio: 'https://rostova.design' },
    },
  ];

  const handleSimulatedScan = async (builder: typeof sampleBuilders[0]) => {
    setIsProcessing(true);
    await triggerSuccessHaptic();

    setTimeout(() => {
      const newCard: ConnectionCard = {
        id: `conn_${Date.now()}`,
        userId: `user_${Math.random().toString(36).substring(7)}`,
        fullName: builder.name,
        roleTitle: builder.role,
        avatar: builder.avatar,
        pitch: builder.pitch,
        eventId: 'event_genesis_hacks_2026',
        eventName: currentEventName,
        timestamp: new Date().toISOString(),
        tags: ['#GenesisBuilder'],
        privateNote: '',
        socialLinks: builder.socials,
      };

      setIsProcessing(false);
      onScanSuccess(newCard);
    }, 350); // < 400ms SLA speed
  };

  const handleManualPayloadSubmit = () => {
    if (!manualInput.trim()) return;
    setIsProcessing(true);
    triggerSuccessHaptic();

    try {
      const parsed = JSON.parse(manualInput) as QRPayload;
      const newCard: ConnectionCard = {
        id: `conn_${Date.now()}`,
        userId: parsed.userId || `user_${Date.now()}`,
        fullName: parsed.displayName || 'Genesis Builder',
        roleTitle: parsed.roleTitle || 'Developer',
        avatar: parsed.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        pitch: parsed.pitch || 'Building cool projects at Genesis Hackathon!',
        eventId: parsed.eventId || 'event_genesis_hacks_2026',
        eventName: currentEventName,
        timestamp: new Date(parsed.timestamp || Date.now()).toISOString(),
        tags: ['#MutualExchange'],
        privateNote: '',
        socialLinks: parsed.socials || {},
      };
      setIsProcessing(false);
      onScanSuccess(newCard);
    } catch {
      // Fallback format if string payload
      const newCard: ConnectionCard = {
        id: `conn_${Date.now()}`,
        userId: `user_${Date.now()}`,
        fullName: manualInput.slice(0, 20),
        roleTitle: 'Hacker',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        pitch: 'Scanned via manual fallback payload',
        eventId: 'event_genesis_hacks_2026',
        eventName: currentEventName,
        timestamp: new Date().toISOString(),
        tags: ['#ManualScan'],
        privateNote: '',
        socialLinks: {},
      };
      setIsProcessing(false);
      onScanSuccess(newCard);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 border border-indigo-500/30 shadow-2xl flex flex-col items-center max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-bold border border-indigo-500/20 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Dual Exchange (&lt; 400ms)</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Scan Builder Badge</h3>
          <p className="text-xs text-slate-400">Position QR code inside frame to connect</p>
        </div>

        {/* Viewfinder Target Area */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 rounded-3xl overflow-hidden border-2 border-indigo-500/40 bg-slate-900/90 flex flex-col items-center justify-center shadow-inner">
          {/* Animated Scanner Laser */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#818cf8] animate-scan-line z-10" />

          {/* Viewfinder Corner Brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />

          {isProcessing ? (
            <div className="flex flex-col items-center space-y-2 text-indigo-400 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Exchanging Cryptographic Badges...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
              <Camera className="w-10 h-10 text-indigo-400/70 animate-bounce" />
              <p className="text-xs text-slate-300 font-medium">
                Align QR badge within frame
              </p>
              <span className="text-[10px] text-slate-500">Camera active & listening</span>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between w-full mt-3 px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-800">
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              torchOn ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flashlight className="w-4 h-4" />
            <span>{torchOn ? 'Flash On' : 'Flash Off'}</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Mutual 2-Way Unlock</span>
          </div>
        </div>

        {/* Interactive Desktop / Web Sandbox Simulator */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Web Sandbox: Tap to Simulate Instant Scan
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
              Dev Sandbox
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sampleBuilders.map((builder, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulatedScan(builder)}
                disabled={isProcessing}
                className="flex flex-col items-center p-2 rounded-xl bg-slate-900/80 hover:bg-indigo-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all text-center group"
              >
                <img
                  src={builder.avatar}
                  alt={builder.name}
                  className="w-10 h-10 rounded-full object-cover mb-1 group-hover:scale-105 transition-transform border border-indigo-500/30"
                />
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-300 truncate w-full">
                  {builder.name}
                </span>
                <span className="text-[9px] text-slate-400 truncate w-full">{builder.role.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Manual Payload Fallback */}
          <div className="pt-2 border-t border-indigo-900/40 flex items-center gap-2">
            <input
              type="text"
              placeholder="Paste raw QR token payload..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs"
            />
            <button
              onClick={handleManualPayloadSubmit}
              className="px-3 py-1.5 rounded-xl gradient-btn text-white text-xs font-semibold"
            >
              Parse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
