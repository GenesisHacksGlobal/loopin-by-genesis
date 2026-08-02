import React, { useState } from 'react';
import { QrCode, Scan, Users, Compass, User, Bell, Shield, Sparkles } from 'lucide-react';
import type { GenesisNotification } from '../types';

interface NavbarProps {
  activeTab: 'badge' | 'scan' | 'connections' | 'hub' | 'profile';
  setActiveTab: (tab: 'badge' | 'scan' | 'connections' | 'hub' | 'profile') => void;
  openScanner: () => void;
  eventName: string;
  notifications: GenesisNotification[];
  markNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openScanner,
  eventName,
  notifications,
  markNotificationRead,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5.5 h-5.5 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight gradient-text">Loopin</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  by Genesis
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                {eventName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Scan Action Header Button */}
            <button
              onClick={openScanner}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl gradient-btn text-white text-xs font-semibold shadow-md hover:scale-105 transition-transform"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Badge</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notifications */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel-glow rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      Genesis Notifications
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            notif.read
                              ? 'bg-slate-900/40 border-slate-800/50 text-slate-400'
                              : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="text-indigo-300">{notif.title}</span>
                            <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Badge indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPDP Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Floating Navigation Bar */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg glass-panel rounded-2xl border border-slate-800/90 shadow-2xl p-1.5">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab('badge')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'badge'
                ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <QrCode className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">My Badge</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('scan');
              openScanner();
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'scan'
                ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="relative">
              <Scan className="w-5 h-5 mb-0.5 text-indigo-400" />
            </div>
            <span className="text-[10px] font-semibold text-indigo-300">Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('connections')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'connections'
                ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('hub')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'hub'
                ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Genesis Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
