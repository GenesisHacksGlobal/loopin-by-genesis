import React, { useState } from 'react';
import { Calendar, MapPin, Users, ExternalLink, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import type { GenesisEventItem } from '../types';

interface EventCardProps {
  event: GenesisEventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [showAgenda, setShowAgenda] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div className="card-pricing-featured overflow-hidden border border-[#533afd]/40 hover:border-[#533afd] transition-all space-y-0 group">
      {/* Event Header Banner */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1e54] via-[#1c1e54]/50 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          {event.status === 'live' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-lg font-tabular">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE HACKATHON
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#533afd] text-white text-[10px] font-bold tracking-wider uppercase shadow-lg font-tabular">
              UPCOMING
            </span>
          )}
        </div>

        {/* Attendee Pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-[#0d253d]/80 text-[#b9b9f9] text-[11px] font-bold border border-[#a8c3de]/20 font-tabular backdrop-blur-md">
          <Users className="w-3.5 h-3.5" />
          <span>{event.participantsCount}+ Hackers</span>
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-display-lg text-xl text-white font-light tracking-tight leading-snug">{event.title}</h3>
        </div>
      </div>

      {/* Details Content */}
      <div className="p-4 space-y-3">
        <p className="font-body-md text-xs text-slate-300 leading-relaxed">{event.tagline}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-[#a8c3de] font-tabular">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0d253d]/60 border border-[#a8c3de]/15">
            <Calendar className="w-4 h-4 text-[#533afd]" />
            <span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0d253d]/60 border border-[#a8c3de]/15">
            <MapPin className="w-4 h-4 text-[#f96bee]" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Accordion Agenda Toggle */}
        {event.agenda && event.agenda.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-[#e3e8ee]/10 font-tabular">
            <button
              onClick={() => setShowAgenda(!showAgenda)}
              className="w-full flex items-center justify-between text-xs font-semibold text-[#b9b9f9] hover:text-white transition-colors"
            >
              <span>View Hackathon Agenda ({event.agenda.length} Sessions)</span>
              {showAgenda ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAgenda && (
              <div className="p-3 rounded-xl bg-[#0d253d]/90 border border-[#a8c3de]/20 text-xs space-y-1.5 animate-in fade-in font-tabular">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#533afd] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsRegistered(!isRegistered)}
            className={`w-full py-2.5 rounded-full font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              isRegistered
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                : 'btn-primary-pill shadow-lg shadow-[#533afd]/30 hover:scale-[1.01]'
            }`}
          >
            {isRegistered ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="font-tabular">RSVP Confirmed (Badge Pre-Activated)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>RSVP & Activate Badge</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
