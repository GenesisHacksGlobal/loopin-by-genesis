import React, { useState } from 'react';
import { Lock, Edit3, Trash2, ExternalLink, Calendar } from 'lucide-react';
import type { ConnectionCard as ConnectionCardType } from '../types';

interface ConnectionCardProps {
  connection: ConnectionCardType;
  onEditNote: (connection: ConnectionCardType) => void;
  onDelete: (id: string) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onEditNote,
  onDelete,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const formattedDate = new Date(connection.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 hover:border-indigo-500/30 transition-all shadow-lg space-y-3 relative group">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={connection.avatar}
            alt={connection.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-indigo-500/30 flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-base font-extrabold text-white truncate group-hover:text-indigo-300 transition-colors">
              {connection.fullName}
            </h4>
            <p className="text-xs text-indigo-400 font-medium truncate">{connection.roleTitle}</p>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="text-slate-400 truncate">{connection.eventName}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEditNote(connection)}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 border border-slate-700/50 transition-colors"
            title="Edit Private Note"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 border border-slate-700/50 transition-colors"
            title="Delete Connection"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showConfirmDelete && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-xs animate-in fade-in">
          <span className="text-rose-200 font-medium">Remove connection?</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDelete(connection.id)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px]"
            >
              Delete
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium text-[10px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pitch Summary */}
      {connection.pitch && (
        <p className="text-xs text-slate-300 font-medium italic p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          "{connection.pitch}"
        </p>
      )}

      {/* Private Note Badge */}
      {connection.privateNote ? (
        <div
          onClick={() => onEditNote(connection)}
          className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 cursor-pointer hover:border-indigo-500/40 transition-colors text-xs text-slate-200 space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] text-indigo-400 font-bold">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-400" />
              Private Encrypted Note
            </span>
            <span className="text-slate-500 hover:text-indigo-300">Edit Note</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{connection.privateNote}</p>
        </div>
      ) : (
        <button
          onClick={() => onEditNote(connection)}
          className="w-full py-1.5 rounded-xl border border-dashed border-slate-800 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Lock className="w-3 h-3" />
          <span>Add private post-scan note...</span>
        </button>
      )}

      {/* Skill Tags */}
      {connection.tags && connection.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {connection.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Social Profile Links */}
      {connection.socialLinks && Object.keys(connection.socialLinks).length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
          {connection.socialLinks.github && (
            <a
              href={connection.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-colors"
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
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-colors"
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
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-colors"
            >
              <span>X / Twitter</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          )}
          {connection.socialLinks.portfolio && (
            <a
              href={connection.socialLinks.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-colors"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
