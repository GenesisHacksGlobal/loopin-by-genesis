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
      {/* Genesis Hub Banner (card-dashboard-mockup light) */}
      <div className="card-dashboard-mockup relative overflow-hidden space-y-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-[#533afd]/10 border border-[#533afd]/30 text-[#533afd]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="pill-tag-soft">Genesis Ecosystem Portal</span>
            <h2 className="font-display-lg text-2xl text-[#0d253d] font-light tracking-tight">Genesis Direct Feed</h2>
          </div>
        </div>

        <p className="font-body-md text-xs text-[#64748d] leading-relaxed">
          Bridging discrete offline hackathons and meetups into a unified digital builder network. Discover upcoming events and track ecosystem credentials.
        </p>
      </div>

      {/* Warm Cream Band Feature Card (card-cream-band from DESIGN.md) */}
      <div className="card-cream-band space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display-md text-lg text-[#0d253d] font-normal tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#9b6829]" />
            Ecosystem Network Analytics
          </h3>
          <span className="pill-tag-soft bg-[#0d253d] text-white font-tabular">
            Live Graph
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 font-tabular">
          <div className="p-3 rounded-xl bg-white/90 border border-[#9b6829]/20 shadow-xs flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-[#9b6829] flex-shrink-0" />
            <div>
              <span className="text-lg font-bold text-[#0d253d] block">{user.badges.length} Unlocked</span>
              <span className="text-[10px] text-[#64748d] font-semibold uppercase">Ecosystem Credentials</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/90 border border-[#ea2261]/20 shadow-xs flex items-center space-x-3">
            <Flame className="w-6 h-6 text-[#ea2261] flex-shrink-0" />
            <div>
              <span className="text-lg font-bold text-[#0d253d] block">{user.totalConnections} Builders</span>
              <span className="text-[10px] text-[#64748d] font-semibold uppercase">Mutual Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnable Community Badges Showcase */}
      <div className="space-y-3">
        <h3 className="font-display-md text-lg text-[#0d253d] font-light flex items-center gap-2">
          <Award className="w-5 h-5 text-[#f96bee]" />
          Verified Hacker Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className="card-feature-light p-3.5 border border-[#e3e8ee] hover:border-[#533afd]/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-full bg-[#533afd]/10 text-[#533afd]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="pill-tag-soft bg-emerald-50 text-emerald-700 font-tabular">
                  Verified
                </span>
              </div>
              <h4 className="font-heading-md text-xs font-semibold text-[#0d253d]">{b.name}</h4>
              <p className="font-body-md text-[11px] text-[#64748d] leading-tight">{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Genesis Events Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-tabular">
          <h3 className="font-display-md text-lg text-[#0d253d] font-light flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#533afd]" />
            Official Hackathons & Workshops
          </h3>
          <span className="pill-tag-soft">{events.length} Active Events</span>
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
