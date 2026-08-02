import React from 'react';
import { Shield, Eye, EyeOff, Github, Linkedin, Twitter, MessageSquare, Globe, Instagram } from 'lucide-react';
import type { SocialVisibility, SocialLinks } from '../types';

interface SocialToggleGroupProps {
  socialLinks: SocialLinks;
  visibility: SocialVisibility;
  onToggle: (platform: keyof SocialVisibility) => void;
  onUpdateLink: (platform: keyof SocialLinks, value: string) => void;
}

export const SocialToggleGroup: React.FC<SocialToggleGroupProps> = ({
  socialLinks,
  visibility,
  onToggle,
  onUpdateLink,
}) => {
  const platforms: Array<{
    key: keyof SocialVisibility;
    label: string;
    icon: React.ElementType;
    placeholder: string;
  }> = [
    { key: 'github', label: 'GitHub Profile', icon: Github, placeholder: 'https://github.com/username' },
    { key: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
    { key: 'twitter', label: 'X / Twitter Handle', icon: Twitter, placeholder: 'https://x.com/username' },
    { key: 'discord', label: 'Discord Username', icon: MessageSquare, placeholder: 'username#1234' },
    { key: 'portfolio', label: 'Personal Website', icon: Globe, placeholder: 'https://yourwebsite.dev' },
    { key: 'instagram', label: 'Instagram Handle', icon: Instagram, placeholder: 'https://instagram.com/username' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Granular Social Link Privacy
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Privacy default is <strong className="text-amber-400 font-bold">OFF</strong>. Only enabled links appear in scanned QR badges.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {platforms.map(({ key, label, icon: Icon, placeholder }) => {
          const isVisible = visibility[key];
          const currentValue = socialLinks[key] || '';

          return (
            <div
              key={key}
              className={`p-3 rounded-xl border transition-all ${
                isVisible
                  ? 'bg-indigo-950/20 border-indigo-500/40'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isVisible ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold text-slate-200">{label}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggle(key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    isVisible
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isVisible ? (
                    <>
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-amber-400" />
                      <span>Hidden (OFF)</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                placeholder={placeholder}
                value={currentValue}
                onChange={(e) => onUpdateLink(key, e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
