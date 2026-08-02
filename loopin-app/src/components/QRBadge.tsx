import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, RefreshCw, Scan, Check, Eye, EyeOff, Share2 } from 'lucide-react';
import type { UserProfile, EventScope, QRPayload } from '../types';

interface QRBadgeProps {
  user: UserProfile;
  event: EventScope;
  openScanner: () => void;
}

export const QRBadge: React.FC<QRBadgeProps> = ({ user, event, openScanner }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [signature, setSignature] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate dynamic cryptographic signature token
  const refreshSignature = () => {
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setSignature(`sig_genesis_${Date.now()}_${randomHex}`);
    setSecondsRemaining(60);
  };

  useEffect(() => {
    refreshSignature();
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          refreshSignature();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute visible socials based on user's privacy toggles
  const visibleSocials = Object.entries(user.socialVisibility).reduce(
    (acc, [key, isVisible]) => {
      if (isVisible && user.socialLinks[key as keyof typeof user.socialLinks]) {
        acc[key as keyof typeof user.socialLinks] =
          user.socialLinks[key as keyof typeof user.socialLinks];
      }
      return acc;
    },
    {} as Record<string, string | undefined>
  );

  const payload: QRPayload = {
    userId: user.id,
    eventId: event.id,
    timestamp: Date.now(),
    signature,
    displayName: user.fullName,
    roleTitle: user.roleTitle,
    pitch: user.pitch,
    avatar: user.avatar,
    socials: visibleSocials,
  };

  const payloadString = JSON.stringify(payload);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const visibleSocialCount = Object.values(user.socialVisibility).filter(Boolean).length;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Event Header Banner */}
      <div className="glass-panel rounded-2xl p-4 text-center border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">
            Genesis Official Digital Badge
          </span>
        </div>
        <h2 className="text-lg font-extrabold text-white tracking-tight">{event.name}</h2>
        <p className="text-xs text-slate-400">{event.location}</p>
      </div>

      {/* Main Digital QR Pass Card */}
      <div className="glass-panel-glow rounded-3xl p-6 relative overflow-hidden shadow-2xl border border-indigo-500/30">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* User Info Header */}
          <div className="flex items-center space-x-3 mb-4 w-full">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold text-white truncate">{user.fullName}</h3>
              <p className="text-xs text-indigo-300 font-medium truncate">{user.roleTitle}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Opaque Payload</span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative p-4 rounded-2xl bg-white/95 shadow-2xl border-4 border-indigo-600/20 group hover:scale-[1.02] transition-transform">
            <QRCodeSVG
              value={payloadString}
              size={200}
              bgColor={"#FFFFFF"}
              fgColor={"#0F172A"}
              level={"M"}
              includeMargin={false}
              imageSettings={{
                src: "https://api.iconify.design/lucide:zap.svg?color=%236366f1",
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
          </div>

          {/* Dynamic Refresh Bar */}
          <div className="w-full mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
                Auto-rotates in {secondsRemaining}s
              </span>
              <button
                onClick={refreshSignature}
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
              >
                Refresh Now
              </button>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(secondsRemaining / 60) * 100}%` }}
              />
            </div>
          </div>

          {/* Single-Line Pitch Box */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">
              Event Pitch & Request
            </span>
            <p className="text-xs text-slate-200 font-medium italic">
              "{user.pitch}"
            </p>
          </div>

          {/* Privacy Status Summary */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              {visibleSocialCount > 0 ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-amber-400" />
              )}
              <span>{visibleSocialCount} social handle{visibleSocialCount !== 1 ? 's' : ''} visible</span>
            </span>
            <span className="text-[10px] text-slate-500">Opt-in DPDP compliant</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={openScanner}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl gradient-btn text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-transform"
        >
          <Scan className="w-4 h-4" />
          <span>Scan Builder Badge</span>
        </button>

        <button
          onClick={handleCopyPayload}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl glass-panel text-slate-200 hover:text-white font-semibold text-xs border border-slate-700/60 hover:bg-slate-800/60 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Token Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Copy Pass Token</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
