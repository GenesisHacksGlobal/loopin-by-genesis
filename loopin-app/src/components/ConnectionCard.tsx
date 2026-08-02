import React, { useState } from 'react';
import { StickyNote, Tag, Trash2, Edit3, Lock, ShieldCheck } from 'lucide-react';
import type { ConnectionCard as ConnectionCardType } from '../types';

interface ConnectionCardProps {
  connection: ConnectionCardType;
  onEditNote: (connection: ConnectionCardType) => void;
  onDelete: (id: string) => void;
}

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onEditNote,
  onDelete,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div className="card-feature-light border border-[#e3e8ee]/15 hover:border-[#533afd]/40 transition-all space-y-3 relative group">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <img
            src={connection.avatar}
            alt={connection.fullName}
            className="w-12 h-12 rounded-full object-cover border border-[#533afd]/30 shadow-md"
          />
          <div>
            <h3 className="font-heading-md text-base text-white font-light">{connection.fullName}</h3>
            <p className="font-body-md text-xs text-[#b9b9f9] font-medium">{connection.roleTitle}</p>
            <div className="flex items-center space-x-2 text-[10px] text-[#64748d] mt-0.5 font-tabular">
              <span>{connection.scannedEventName}</span>
              <span>•</span>
              <span>{new Date(connection.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Social Quick Links */}
        <div className="flex items-center space-x-1.5">
          {connection.socials.github && (
            <a
              href={connection.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full bg-[#1c1e54] text-[#a8c3de] hover:text-white hover:bg-[#533afd] transition-colors"
              title="GitHub"
            >
              <GithubIcon />
            </a>
          )}
          {connection.socials.linkedin && (
            <a
              href={connection.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full bg-[#1c1e54] text-[#a8c3de] hover:text-white hover:bg-[#533afd] transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon />
            </a>
          )}
          {connection.socials.twitter && (
            <a
              href={connection.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full bg-[#1c1e54] text-[#a8c3de] hover:text-white hover:bg-[#533afd] transition-colors"
              title="X / Twitter"
            >
              <TwitterIcon />
            </a>
          )}
        </div>
      </div>

      {/* Pitch Quote */}
      {connection.pitch && (
        <p className="font-body-md text-xs text-slate-300 italic px-3 py-1.5 rounded-lg bg-[#0d253d]/60 border border-[#e3e8ee]/10">
          "{connection.pitch}"
        </p>
      )}

      {/* Private Encrypted Note Block */}
      <div className="p-3 rounded-xl bg-[#1c1e54]/50 border border-[#533afd]/20 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#b9b9f9]">
          <span className="flex items-center gap-1.5 font-semibold">
            <Lock className="w-3 h-3 text-emerald-400" />
            <StickyNote className="w-3 h-3 text-[#533afd]" />
            Private Encrypted Context Note
          </span>
          <button
            onClick={() => onEditNote(connection)}
            className="flex items-center gap-1 text-[#665efd] hover:text-white transition-colors font-medium"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Note</span>
          </button>
        </div>
        <p className="font-body-md text-xs text-slate-200 leading-relaxed">
          {connection.privateNote || 'No private notes saved yet. Click Edit to add context...'}
        </p>
      </div>

      {/* Skill Tags & Management Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="w-3 h-3 text-[#64748d]" />
          {connection.tags.map((tag) => (
            <span key={tag} className="pill-tag-soft">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {showConfirmDelete ? (
            <div className="flex items-center space-x-1.5 text-xs animate-in fade-in font-tabular">
              <span className="text-rose-400 font-medium">Delete contact?</span>
              <button
                onClick={() => onDelete(connection.id)}
                className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-2 py-0.5 rounded-full bg-[#1c1e54] text-slate-300 text-[10px]"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 rounded-full hover:bg-rose-950/40 text-[#64748d] hover:text-rose-400 transition-colors"
              title="Delete connection"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-tabular">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified Exchange</span>
          </div>
        </div>
      </div>
    </div>
  );
};
