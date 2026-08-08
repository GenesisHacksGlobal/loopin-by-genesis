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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-feature-light">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-display-lg text-xl text-[#0d253d] font-light tracking-tight">Saved Connections</h2>
            <span className="pill-tag-soft font-tabular">
              {connections.length} Contacts
            </span>
          </div>
          <p className="font-body-md text-xs text-[#64748d] mt-0.5 flex items-center gap-1 font-tabular">
            <Lock className="w-3 h-3 text-[#533afd]" /> Private notes & tags (local only)
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportToCSV(connections)}
            className="btn-secondary-pill text-xs py-1.5 px-3"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportTovCard(connections)}
            className="btn-secondary-pill text-xs py-1.5 px-3"
            title="Download vCard"
          >
            <Contact className="w-3.5 h-3.5 text-[#533afd]" />
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
          className="w-full pl-10 pr-4 py-3 text-input-stripi text-xs rounded-full shadow-xs"
        />
        <Search className="w-4 h-4 text-[#64748d] absolute left-3.5 top-3.5" />
      </div>

      {/* Tag Filters Scrollable Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar font-tabular">
        <Filter className="w-3.5 h-3.5 text-[#64748d] flex-shrink-0" />
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilterTag(tag)}
            className={`text-xs font-medium px-3.5 py-1 rounded-full whitespace-nowrap transition-all border ${
              activeFilterTag === tag
                ? 'bg-[#533afd] text-white border-[#533afd] shadow-sm'
                : 'bg-white text-[#273951] border-[#e3e8ee] hover:border-[#533afd]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredConnections.length === 0 ? (
          <div className="card-dashboard-mockup p-8 text-center space-y-3">
            <Users className="w-12 h-12 text-[#64748d] mx-auto" />
            <h4 className="font-heading-md text-sm text-[#0d253d]">No connections match your query</h4>
            <p className="font-body-md text-xs text-[#64748d]">Scan a hacker's QR badge to save them into your directory.</p>
            <button
              onClick={openScanner}
              className="btn-primary-pill text-xs py-2 px-4 shadow-lg"
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
