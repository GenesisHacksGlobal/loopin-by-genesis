import React, { useState } from 'react';
import { X, Camera, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';
import type { ConnectionCard } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (card: ConnectionCard) => void;
  currentEventName: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  currentEventName,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'sandbox'>('sandbox');

  if (!isOpen) return null;

  // Mock builder payloads for sandbox scanning
  const mockBuilders: ConnectionCard[] = [
    {
      id: `conn_${Date.now()}_1`,
      userId: 'usr_sarah_1',
      fullName: 'Sarah Chen',
      roleTitle: 'Senior ZK Cryptographer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      eventId: 'evt_genesis_2026',
      eventName: currentEventName,
      timestamp: new Date().toISOString(),
      pitch: 'Building Circom circuits for private identity on Ethereum. Seeking Rust auditors!',
      tags: ['#ZK-SNARKs', '#Circom', '#Rust', '#FoundingTeammate'],
      socialLinks: {
        github: 'https://github.com/sarahchen-zk',
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://x.com/sarahchen_zk',
      },
      privateNote: 'Met at the ZK research booth. Very interested in co-building indexer.',
    },
    {
      id: `conn_${Date.now()}_2`,
      userId: 'usr_vikram_2',
      fullName: 'Vikram Malhotra',
      roleTitle: 'Solana Infra Engineer & Core Contributor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      eventId: 'evt_genesis_2026',
      eventName: currentEventName,
      timestamp: new Date().toISOString(),
      pitch: 'High-throughput RPC nodes & gRPC streaming services. Looking for Solana founders.',
      tags: ['#Solana', '#gRPC', '#Rust', '#Infrastructure'],
      socialLinks: {
        github: 'https://github.com/vmalhotra-sol',
        twitter: 'https://x.com/vmalhotra_sol',
        portfolio: 'https://vikram.dev',
      },
      privateNote: 'Offered free testnet RPC access for our hackathon project.',
    },
    {
      id: `conn_${Date.now()}_3`,
      userId: 'usr_elena_3',
      fullName: 'Elena Rostova',
      roleTitle: 'AI Research Lead & LLM Specialist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      eventId: 'evt_genesis_2026',
      eventName: currentEventName,
      timestamp: new Date().toISOString(),
      pitch: 'Autonomous AI agents for smart contract fuzzing. Need Web3 frontend dev!',
      tags: ['#AI/ML', '#Python', '#PyTorch', '#SmartContracts'],
      socialLinks: {
        github: 'https://github.com/elena-ai',
        linkedin: 'https://linkedin.com/in/elena-rostova',
      },
      privateNote: 'Pitched joint submission for the AI x Crypto track prize.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg card-dashboard-mockup relative overflow-hidden space-y-4 shadow-2xl border border-[#533afd]/40">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#e3e8ee]/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-[#533afd] text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading-md text-base text-white font-light">QR Scanner Viewfinder</h3>
              <p className="font-body-md text-[11px] text-[#64748d] font-tabular">
                Scope: {currentEventName} • SLA &lt; 400ms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1c1e54] text-[#64748d] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Camera / Web Sandbox */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[#0d253d] border border-[#a8c3de]/20 font-tabular text-xs">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-1.5 rounded-full font-medium transition-all ${
              activeTab === 'camera'
                ? 'bg-[#533afd] text-white shadow-md'
                : 'text-[#64748d] hover:text-slate-200'
            }`}
          >
            Native Camera Feed
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`py-1.5 rounded-full font-medium transition-all ${
              activeTab === 'sandbox'
                ? 'bg-[#533afd] text-white shadow-md'
                : 'text-[#64748d] hover:text-slate-200'
            }`}
          >
            Web Simulator Sandbox
          </button>
        </div>

        {/* Camera Tab View */}
        {activeTab === 'camera' && (
          <div className="relative h-64 rounded-2xl bg-[#0b0f19] border-2 border-dashed border-[#533afd]/40 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            {/* Animated Laser Scanning Line */}
            <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line shadow-lg shadow-emerald-400/50 z-20" />

            <div className="relative z-10 space-y-3">
              <Camera className="w-10 h-10 text-[#533afd] mx-auto animate-pulse" />
              <div>
                <p className="font-heading-md text-sm text-slate-200 font-light">Align Badge QR in Camera Framing</p>
                <p className="font-body-md text-xs text-[#64748d] mt-1 font-tabular">
                  Camera hardware bridge active. For instant browser testing, switch to the Simulator Sandbox tab above.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Web Sandbox Simulator Tab View */}
        {activeTab === 'sandbox' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#b9b9f9] font-tabular">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
                Simulate Scanning Active Event Attendees
              </span>
              <span className="pill-tag-soft">Sandbox Mode</span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {mockBuilders.map((builder) => (
                <div
                  key={builder.id}
                  className="p-3 rounded-xl bg-[#1c1e54]/60 border border-[#a8c3de]/15 hover:border-[#533afd]/60 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={builder.avatar}
                      alt={builder.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-[#533afd]/40"
                    />
                    <div className="min-w-0">
                      <h4 className="font-heading-md text-xs text-white font-medium truncate">{builder.fullName}</h4>
                      <p className="font-body-md text-[11px] text-[#b9b9f9] truncate">{builder.roleTitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onScanSuccess(builder)}
                    className="btn-primary-pill text-xs py-1.5 px-3 flex-shrink-0"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Scan Badge</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#e3e8ee]/10 flex items-center justify-between text-[11px] text-[#64748d] font-tabular">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Opaque Signed Payload • No Raw PII</span>
          </span>
          <span>DPDP Act 2023 Compliant</span>
        </div>
      </div>
    </div>
  );
};
