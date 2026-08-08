import React, { useState } from 'react';
import { Sparkles, Shield, ArrowRight, Lock, Mail } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (identifier: string, otp: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState<string>('alex.vance@genesis.dev');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValues, setOtpValues] = useState<string[]>(['8', '9', '2', '1', '4', '0']);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(identifier, otpValues.join(''));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden gradient-mesh-hero">
      <div className="w-full max-w-md card-dashboard-mockup relative z-10 space-y-6 animate-in fade-in duration-300 shadow-xl border border-[#e3e8ee]">
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#533afd] text-white shadow-xl shadow-[#533afd]/25 mb-1">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <span className="pill-tag-soft mb-2">Genesis Eco-System</span>
            <h1 className="font-display-xxl text-4xl sm:text-5xl text-[#0d253d] font-light tracking-tight mt-1">
              Loopin
            </h1>
          </div>
          <p className="font-body-md text-xs text-[#64748d]">
            Scan once, never lose a connection. Privacy-first builder networking pass.
          </p>
        </div>

        {!otpSent ? (
          /* Step 1: Identifier Input Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0d253d] flex items-center justify-between">
                <span>Email or Phone Identifier</span>
                <span className="text-[10px] text-emerald-600 font-tabular font-medium">Passwordless OTP</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@genesis.dev or +1..."
                  required
                  className="w-full pl-10 pr-4 py-3 text-input-stripi text-xs"
                />
                <Mail className="w-4 h-4 text-[#64748d] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 btn-primary-pill text-xs font-semibold shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Send Passcode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP Entry Form */
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in">
            <div className="p-3 rounded-xl bg-[#f6f9fc] border border-[#533afd]/20 text-center">
              <span className="text-xs text-[#4434d4] font-tabular">
                Passcode sent to <strong className="text-[#0d253d]">{identifier}</strong>
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0d253d] block text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex justify-center gap-2">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newVals = [...otpValues];
                      newVals[idx] = e.target.value;
                      setOtpValues(newVals);
                    }}
                    className="w-11 h-12 text-center text-lg font-bold font-tabular text-[#0d253d] text-input-stripi focus:border-[#533afd]"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 btn-primary-pill text-xs font-semibold shadow-lg flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Verify & Access Badge</span>
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-[#64748d] hover:text-[#0d253d] transition-colors"
            >
              Change Email / Phone Number
            </button>
          </form>
        )}

        {/* DPDP Compliance Notice */}
        <div className="pt-4 border-t border-[#e3e8ee] text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Zero Password Overhead & DPDP Act 2023 Compliant</span>
          </div>
          <p className="text-[10px] text-[#64748d]">
            Session tokens automatically refreshed per event scope.
          </p>
        </div>
      </div>
    </div>
  );
};
