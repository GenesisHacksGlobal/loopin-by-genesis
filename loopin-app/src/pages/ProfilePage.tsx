import React, { useState } from 'react';
import type { UserProfile, SocialVisibility, SocialLinks } from '../types';
import { SocialToggleGroup } from '../components/SocialToggleGroup';
import { User, Save, LogOut, Trash2, CheckCircle2, Sparkles, Plus, X } from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onToggleSocial: (platform: keyof SocialVisibility) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onToggleSocial,
  onLogout,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [roleTitle, setRoleTitle] = useState(user.roleTitle);
  const [bio, setBio] = useState(user.bio);
  const [pitch, setPitch] = useState(user.pitch);
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(user.coreTechStack);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(user.socialLinks);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletedMsg, setDeletedMsg] = useState(false);

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (item: string) => {
    setTechStack(techStack.filter((t) => t !== item));
  };

  const handleUpdateSocialLink = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      fullName,
      roleTitle,
      bio,
      pitch,
      coreTechStack: techStack,
      socialLinks,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAccountDeletion = () => {
    setDeletedMsg(true);
    setTimeout(() => {
      onLogout();
    }, 2000);
  };

  return (
    <div className="w-full pb-28 pt-2 px-4 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-indigo-500/30 shadow-2xl flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
        />
        <div>
          <h2 className="text-xl font-black text-white">{user.fullName}</h2>
          <p className="text-xs text-indigo-400 font-semibold">{user.roleTitle}</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Global Identity • {user.totalConnections} Connections
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5">
        {/* Global Hacker Info */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-indigo-400" />
            Global Identity & Bio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Role / Headline</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Core Tech Stack Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Core Tech Stack</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add tech (e.g. Rust, PyTorch)..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"
                >
                  {tech}
                  <button type="button" onClick={() => handleRemoveTech(tech)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Event-Scoped Pitch Box */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Event-Scoped Pitch ("What I'm building / looking for")
          </h3>
          <p className="text-xs text-slate-400">
            This single-line elevator pitch is displayed on your active event QR badge.
          </p>
          <input
            type="text"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="e.g. Building Solana ZK indexer. Looking for Rust dev!"
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        {/* Granular Social Link Privacy Toggles */}
        <SocialToggleGroup
          socialLinks={socialLinks}
          visibility={user.socialVisibility}
          onToggle={onToggleSocial}
          onUpdateLink={handleUpdateSocialLink}
        />

        {/* Save Changes Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl gradient-btn text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 hover:scale-[1.01] transition-transform"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Profile Updated Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Hacker Profile & Privacy Settings</span>
            </>
          )}
        </button>
      </form>

      {/* Account Settings & Regulatory Deletion */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300">Account & Regulatory Compliance</h4>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Delete Account</span>
          </button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 space-y-2 text-xs animate-in fade-in">
            <span className="text-white font-bold block">DPDP Act 2023 / GDPR Right to be Forgotten</span>
            <p className="text-rose-200">
              Permanently delete your profile and purge all personal records within 30 days.
            </p>
            {deletedMsg ? (
              <span className="text-emerald-400 font-bold block">Account deletion requested. Purging data...</span>
            ) : (
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleAccountDeletion}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                >
                  Confirm Permanent Erasure
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
