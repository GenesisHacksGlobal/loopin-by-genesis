import React from 'react';
import { QRBadge } from '../components/QRBadge';
import type { UserProfile, EventScope } from '../types';

interface BadgePageProps {
  user: UserProfile;
  event: EventScope;
  openScanner: () => void;
}

export const BadgePage: React.FC<BadgePageProps> = ({ user, event, openScanner }) => {
  return (
    <div className="w-full pb-28 pt-2 px-4 space-y-6 max-w-xl mx-auto">
      {/* Dynamic QR Pass */}
      <QRBadge user={user} event={event} openScanner={openScanner} />

      {/* Networking Activity Metric Pill */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xl font-black text-indigo-400 block">{user.totalConnections}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Mutual Scans</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xl font-black text-purple-400 block">{user.badges.length}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Genesis Badges</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xl font-black text-emerald-400 block">&lt; 400ms</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Scan SLA</span>
        </div>
      </div>
    </div>
  );
};
