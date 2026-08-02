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
      {/* Light nav-bar-on-mesh Component */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#e3e8ee] px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#533afd] text-white shadow-md shadow-[#533afd]/20">
              <Sparkles className="w-5 h-5" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display-lg text-lg text-[#0d253d] font-normal tracking-tight">Loopin</span>
                <span className="pill-tag-soft">by Genesis</span>
              </div>
              <p className="text-[11px] text-[#64748d] flex items-center gap-1 font-tabular">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                {eventName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* button-primary-pill CTA */}
            <button
              onClick={openScanner}
              className="btn-primary-pill"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Badge</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-full bg-white hover:bg-slate-100 border border-[#a8c3de]/40 text-[#0d253d] transition-colors shadow-2xs"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ea2261] text-white text-[10px] font-bold font-tabular flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Card */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 card-dashboard-mockup z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
                    <h4 className="font-heading-md text-sm text-[#0d253d] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#533afd]" />
                      Genesis Feed Notifications
                    </h4>
                    <span className="pill-tag-soft font-tabular">{unreadCount} new</span>
                  </div>
                  <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#64748d] py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            notif.read
                              ? 'bg-slate-50 border-[#e3e8ee] text-[#64748d]'
                              : 'bg-[#f6f9fc] border-[#533afd]/30 text-[#0d253d]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="text-[#533afd]">{notif.title}</span>
                            <span className="text-[10px] text-[#64748d] font-tabular">{notif.timestamp}</span>
                          </div>
                          <p className="text-[#273951] text-xs leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* DPDP Compliance Tag */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[11px] text-[#0d253d]">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>DPDP Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Bottom Pill Navigation Bar in Light Style */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md bg-white/90 backdrop-blur-xl rounded-full border border-[#e3e8ee] shadow-2xl p-1.5">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab('badge')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
              activeTab === 'badge'
                ? 'bg-[#533afd] text-white shadow-md shadow-[#533afd]/30'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <QrCode className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[10px] font-medium">Badge</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('scan');
              openScanner();
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
              activeTab === 'scan'
                ? 'bg-[#533afd] text-white shadow-md shadow-[#533afd]/30'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <Scan className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[10px] font-medium">Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('connections')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
              activeTab === 'connections'
                ? 'bg-[#533afd] text-white shadow-md shadow-[#533afd]/30'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <Users className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[10px] font-medium">Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('hub')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
              activeTab === 'hub'
                ? 'bg-[#533afd] text-white shadow-md shadow-[#533afd]/30'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <Compass className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[10px] font-medium">Genesis Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
              activeTab === 'profile'
                ? 'bg-[#533afd] text-white shadow-md shadow-[#533afd]/30'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <User className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
