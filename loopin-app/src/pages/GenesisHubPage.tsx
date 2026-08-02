import React from 'react';
import { Compass, Award, Calendar, Sparkles, Trophy, Flame } from 'lucide-react';
import type { GenesisEventItem, UserProfile } from '../types';
import { EventCard } from '../components/EventCard';

interface GenesisHubPageProps {
  events: GenesisEventItem[];
  user: UserProfile;
}

export const GenesisHubPage: React.FC<GenesisHubPageProps> = ({ events, user }) => {
  return (
    <div className="w-full pb-28 pt-2 px-4 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Genesis Hub Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-3">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
              Genesis Ecosystem Portal
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">Genesis Direct Feed</h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Bridging discrete offline hackathons and meetups into a unified digital builder network. Discover upcoming events and track ecosystem achievements.
        </p>

        {/* Ecosystem Hacker Graph Stat Pill */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-base font-extrabold text-white block">{user.badges.length} Unlocked</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Ecosystem Badges</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center space-x-3">
            <Flame className="w-6 h-6 text-rose-400 flex-shrink-0" />
            <div>
              <span className="text-base font-extrabold text-white block">{user.totalConnections} Builders</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Network Graph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnable Community Badges Showcase */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          Ecosystem Hacker Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className="glass-panel p-3.5 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-[9px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Verified
                </span>
              </div>
              <h4 className="text-xs font-extrabold text-white">{b.name}</h4>
              <p className="text-[11px] text-slate-400 leading-tight">{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Genesis Events Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Official Hackathons & Workshops
          </h3>
          <span className="text-[11px] text-slate-400">{events.length} Active Events</span>
        </div>

        <div className="space-y-4">
          {events.map((eventItem) => (
            <EventCard key={eventItem.id} event={eventItem} />
          ))}
        </div>
      </div>
    </div>
  );
};
