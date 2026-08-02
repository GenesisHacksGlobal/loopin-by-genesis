import React, { useState, useMemo } from 'react';
import { Search, FileSpreadsheet, Contact, Filter, Users, Lock } from 'lucide-react';
import type { ConnectionCard as ConnectionCardType } from '../types';
import { ConnectionCard } from '../components/ConnectionCard';
import { useExport } from '../hooks/useExport';

interface ConnectionsPageProps {
  connections: ConnectionCardType[];
  onEditNote: (connection: ConnectionCardType) => void;
  onDeleteConnection: (id: string) => void;
  openScanner: () => void;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({
  connections,
  onEditNote,
  onDeleteConnection,
  openScanner,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('All');
  const { exportToCSV, exportTovCard } = useExport();

  // Extract unique tags across all saved connections
  const allTags = useMemo(() => {
    const set = new Set<string>();
    connections.forEach((c) => c.tags?.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [connections]);

  // Filtered contacts list
  const filteredConnections = useMemo(() => {
    return connections.filter((conn) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        conn.fullName.toLowerCase().includes(query) ||
        conn.roleTitle.toLowerCase().includes(query) ||
        (conn.privateNote || '').toLowerCase().includes(query) ||
        (conn.pitch || '').toLowerCase().includes(query) ||
        conn.tags.some((t) => t.toLowerCase().includes(query));

      const matchesTag =
        activeFilterTag === 'All' || conn.tags.includes(activeFilterTag);

      return matchesQuery && matchesTag;
    });
  }, [connections, searchQuery, activeFilterTag]);

  return (
    <div className="w-full pb-28 pt-2 px-4 space-y-5 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel rounded-2xl p-4 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Saved Connections</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {connections.length} Contacts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-400" /> Private encrypted notes & tags
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportToCSV(connections)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportTovCard(connections)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
            title="Download vCard"
          >
            <Contact className="w-4 h-4 text-purple-400" />
            <span>vCard</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, role, private note, or #tag..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Tag Filters Scrollable Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilterTag(tag)}
            className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
              activeFilterTag === tag
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredConnections.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">No connections match your query</h4>
            <p className="text-xs text-slate-500">Scan a hacker's QR badge to save them into your directory.</p>
            <button
              onClick={openScanner}
              className="px-4 py-2 rounded-xl gradient-btn text-white text-xs font-bold shadow-lg"
            >
              Scan Badge Now
            </button>
          </div>
        ) : (
          filteredConnections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              onEditNote={onEditNote}
              onDelete={onDeleteConnection}
            />
          ))
        )}
      </div>
    </div>
  );
};
