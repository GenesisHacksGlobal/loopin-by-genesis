import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Lock, Tag, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import type { ConnectionCard } from '../types';

interface PostScanModalProps {
  connection: ConnectionCard | null;
  onClose: () => void;
  onSave: (id: string, note: string, tags: string[]) => void;
}

const AVAILABLE_TAGS = [
  '#Rust',
  '#AI/ML',
  '#FullStack',
  '#Solana',
  '#ZeroKnowledge',
  '#UI/UX',
  '#RAG',
  '#DevOps',
  '#FoundingTeammate',
  '#Investor',
];

export const PostScanModal: React.FC<PostScanModalProps> = ({
  connection,
  onClose,
  onSave,
}) => {
  const [note, setNote] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (connection) {
      setNote(connection.privateNote || '');
      setSelectedTags(connection.tags || ['#GenesisBuilder']);
      setSavedSuccess(false);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
        });
      } catch {
        // Confetti optional
      }
    }
  }, [connection]);

  if (!connection) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    onSave(connection.id, note, selectedTags);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 border border-indigo-500/30 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Banner Header */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 mb-2">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Mutual Connection Unlocked!</h3>
          <p className="text-xs text-indigo-300 font-medium">Both profiles exchanged successfully</p>
        </div>

        {/* Hacker Card Preview */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src={connection.avatar}
              alt={connection.fullName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-extrabold text-white truncate">{connection.fullName}</h4>
              <p className="text-xs text-indigo-400 font-medium truncate">{connection.roleTitle}</p>
              <span className="text-[10px] text-slate-400 block mt-0.5">{connection.eventName}</span>
            </div>
          </div>

          {/* Single-Line Pitch */}
          {connection.pitch && (
            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 italic">
              "{connection.pitch}"
            </div>
          )}

          {/* Toggled Social Handles Preview */}
          <div className="flex flex-wrap gap-2 pt-1">
            {connection.socialLinks.github && (
              <a
                href={connection.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
            )}
            {connection.socialLinks.linkedin && (
              <a
                href={connection.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
            )}
            {connection.socialLinks.twitter && (
              <a
                href={connection.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <span>X / Twitter</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
            )}
          </div>
        </div>

        {/* Private Encrypted Note Input */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Private Encrypted Note
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Author Eyes Only
            </span>
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add post-scan context (e.g. 'Discussed building Solana indexing agent together. Follow up Tuesday via Telegram')..."
            className="w-full p-3 rounded-xl glass-input text-xs leading-relaxed focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Skill Tag Selector */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Tag className="w-3.5 h-3.5 text-purple-400" />
            Attach Skill & Context Tags
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all border ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={savedSuccess}
          className="w-full py-3 rounded-xl gradient-btn text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.01]"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>Saved to Connections Directory!</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Save Encrypted Note & Contact</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
