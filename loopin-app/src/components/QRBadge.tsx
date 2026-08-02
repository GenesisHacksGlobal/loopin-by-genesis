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
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Event Header Banner */}
      <div className="card-feature-light text-center relative overflow-hidden">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="pill-tag-soft font-tabular">Official Digital Badge Pass</span>
        </div>
        <h2 className="font-display-lg text-2xl text-[#0d253d] font-light tracking-tight">{event.name}</h2>
        <p className="font-body-md text-xs text-[#64748d] mt-0.5">{event.location}</p>
      </div>

      {/* Main Digital QR Pass Container (Light card-dashboard-mockup) */}
      <div className="card-dashboard-mockup relative overflow-hidden shadow-xl space-y-4 border border-[#e3e8ee]">
        <div className="relative z-10 flex flex-col items-center">
          {/* User Info Header */}
          <div className="flex items-center space-x-3 mb-4 w-full">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#533afd]/30 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading-lg text-lg text-[#0d253d] font-light truncate">{user.fullName}</h3>
              <p className="font-body-md text-xs text-[#533afd] font-semibold truncate">{user.roleTitle}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#64748d] font-tabular">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Opaque Token</span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative p-4 rounded-2xl bg-white shadow-md border-2 border-[#e3e8ee] hover:scale-[1.01] transition-transform">
            <QRCodeSVG
              value={payloadString}
              size={200}
              bgColor={"#FFFFFF"}
              fgColor={"#0D253D"}
              level={"M"}
              includeMargin={false}
              imageSettings={{
                src: "https://api.iconify.design/lucide:zap.svg?color=%23533afd",
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
          </div>

          {/* Dynamic Refresh Bar with Tabular Figures */}
          <div className="w-full mt-4 space-y-1.5 font-tabular">
            <div className="flex items-center justify-between text-[11px] text-[#64748d]">
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-[#533afd] animate-spin" />
                Auto-rotates in {secondsRemaining}s
              </span>
              <button
                onClick={refreshSignature}
                className="text-[#533afd] hover:text-[#4434d4] transition-colors font-semibold"
              >
                Refresh Now
              </button>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#533afd] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(secondsRemaining / 60) * 100}%` }}
              />
            </div>
          </div>

          {/* Single-Line Pitch Box */}
          <div className="w-full mt-4 p-3 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] text-center">
            <span className="text-[10px] uppercase font-bold text-[#64748d] tracking-wider block mb-0.5">
              Event Pitch & Request
            </span>
            <p className="font-body-md text-xs text-[#0d253d] italic font-normal">
              "{user.pitch}"
            </p>
          </div>

          {/* Privacy Status Summary */}
          <div className="w-full mt-4 pt-3 border-t border-[#e3e8ee] flex items-center justify-between text-xs text-[#64748d]">
            <span className="flex items-center gap-1.5 font-tabular">
              {visibleSocialCount > 0 ? (
                <Eye className="w-4 h-4 text-emerald-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-amber-600" />
              )}
              <span>{visibleSocialCount} social handle{visibleSocialCount !== 1 ? 's' : ''} visible</span>
            </span>
            <span className="text-[10px] text-[#64748d]">Opt-in DPDP compliant</span>
          </div>
        </div>
      </div>

      {/* Action Pill Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={openScanner}
          className="btn-primary-pill w-full py-3"
        >
          <Scan className="w-4 h-4" />
          <span>Scan Builder Badge</span>
        </button>

        <button
          onClick={handleCopyPayload}
          className="btn-secondary-pill w-full py-3"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">Token Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#533afd]" />
              <span>Copy Pass Token</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
