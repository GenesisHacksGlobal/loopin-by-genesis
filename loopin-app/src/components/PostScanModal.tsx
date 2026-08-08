import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, StickyNote, Tag, Lock, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ConnectionCard } from '../types';

interface PostScanModalProps {
  connection: ConnectionCard | null;
  onClose: () => void;
  onSave: (id: string, note: string, tags: string[]) => void;
}

export const PostScanModal: React.FC<PostScanModalProps> = ({
  connection,
  onClose,
  onSave,
}) => {
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');

  const suggestedTags = [
    '#ZK-SNARKs',
    '#Solana',
    '#AI/ML',
    '#Rust',
    '#FoundingTeammate',
    '#Investor',
    '#CoFounder',
    '#SmartContracts',
  ];

  useEffect(() => {
    if (connection) {
      setNote(connection.privateNote || '');
      setTags(connection.tags || ['#GenesisHacker']);

      // Fire celebratory confetti on scan success
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#533afd', '#ea2261', '#34d399', '#f96bee'],
      });
    }
  }, [connection]);

  if (!connection) return null;

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const formatted = customTagInput.trim().startsWith('#')
      ? customTagInput.trim()
      : `#${customTagInput.trim()}`;
    if (formatted && !tags.includes(formatted)) {
      setTags([...tags, formatted]);
      setCustomTagInput('');
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(connection.id, note, tags);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d253d]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg card-dashboard-mockup relative overflow-hidden space-y-5 shadow-2xl border border-[#e3e8ee]">
        {/* Header Success Banner */}
        <div className="flex items-center justify-between border-b border-[#e3e8ee] pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="pill-tag-soft bg-emerald-50 text-emerald-700 font-tabular">
                Mutual Badge Exchange Verified
              </span>
              <h3 className="font-heading-md text-base text-[#0d253d] font-normal mt-0.5">Connection Saved to Directory</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#64748d] hover:text-[#0d253d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanned Builder Profile Overview */}
        <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex items-center space-x-3">
          <img
            src={connection.avatar}
            alt={connection.fullName}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#533afd]/30 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-heading-lg text-base text-[#0d253d] font-normal truncate">{connection.fullName}</h4>
            <p className="font-body-md text-xs text-[#533afd] font-semibold truncate">{connection.roleTitle}</p>
            {connection.pitch && (
              <p className="font-body-md text-[11px] text-[#273951] italic truncate mt-0.5">
                "{connection.pitch}"
              </p>
            )}
          </div>
        </div>

        {/* Private Note Editor Form */}
        <form onSubmit={handleSaveNote} className="space-y-4 font-tabular">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0d253d] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5 text-[#533afd]" />
                Private Context Note
              </span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> Visible only to you
              </span>
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add post-scan notes (e.g., 'Met at ZK booth. Wants to partner on Solana indexer hackathon project...')"
              className="w-full p-3 text-input-stripi text-xs rounded-xl"
            />
          </div>

          {/* Skill & Context Tags Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#0d253d] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#f96bee]" />
                Categorization Tags
              </span>
              <span className="text-[10px] text-[#64748d]">{tags.length} selected</span>
            </label>

            {/* Suggested Tags */}
            <div className="flex flex-wrap gap-1.5">
              {suggestedTags.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all border ${
                      isSelected
                        ? 'bg-[#533afd] text-white border-[#533afd] shadow-xs'
                        : 'bg-white text-[#273951] border-[#e3e8ee] hover:border-[#533afd]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="Add custom tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-input-stripi text-xs rounded-full"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="btn-secondary-pill py-1.5 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Save Action Pill Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 btn-primary-pill text-xs font-semibold shadow-lg flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save Private Note to Contacts</span>
            </button>
          </div>
        </form>

        {/* DPDP Compliance Notice */}
        <div className="pt-2 border-t border-[#e3e8ee] text-center font-tabular">
          <p className="text-[10px] text-[#64748d] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Notes are stored only on this device and never sent anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};
