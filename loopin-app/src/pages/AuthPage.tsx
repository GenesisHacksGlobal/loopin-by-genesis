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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0b0f19]">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel-glow rounded-3xl p-8 border border-indigo-500/30 shadow-2xl relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 mb-1">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-black tracking-tight gradient-text">Loopin</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              by Genesis
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Scan once, never lose a connection. Privacy-first builder networking.
          </p>
        </div>

        {!otpSent ? (
          /* Step 1: Identifier Input Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Email or Phone Number</span>
                <span className="text-[10px] text-emerald-400 font-normal">Passwordless OTP</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@genesis.dev or +1..."
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl gradient-btn text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.01]"
            >
              <span>Send One-Time Passcode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP Entry Form */
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in">
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-center">
              <span className="text-[11px] text-indigo-300 font-medium">
                Passcode sent to <strong className="text-white">{identifier}</strong>
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 block text-center">
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
                    className="w-11 h-12 text-center text-lg font-bold text-white glass-input rounded-xl focus:border-indigo-500"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl gradient-btn text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.01]"
            >
              <Lock className="w-4 h-4" />
              <span>Verify & Access Badge</span>
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Change Email / Phone Number
            </button>
          </form>
        )}

        {/* DPDP Compliance Notice */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Zero Password Overhead & DPDP Act 2023 Compliant</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Encrypted session tokens automatically refreshed per event scope.
          </p>
        </div>
      </div>
    </div>
  );
};
