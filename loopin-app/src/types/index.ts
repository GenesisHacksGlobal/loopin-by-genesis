export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  discord?: string;
  portfolio?: string;
  instagram?: string;
}

export interface SocialVisibility {
  github: boolean;
  linkedin: boolean;
  twitter: boolean;
  discord: boolean;
  portfolio: boolean;
  instagram: boolean;
}

export interface CommunityBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar: string;
  roleTitle: string;
  coreTechStack: string[];
  bio: string;
  pitch: string; // Event-scoped pitch: "What I'm building / looking for"
  socialLinks: SocialLinks;
  socialVisibility: SocialVisibility;
  badges: CommunityBadge[];
  totalConnections: number;
}

export interface EventScope {
  id: string;
  name: string;
  location: string;
  date: string;
  isCurrent: boolean;
}

export interface QRPayload {
  userId: string;
  eventId: string;
  timestamp: number;
  signature: string;
  displayName: string;
  roleTitle: string;
  pitch: string;
  avatar: string;
  socials: Partial<SocialLinks>;
}

export interface ConnectionCard {
  id: string;
  userId: string;
  fullName: string;
  roleTitle: string;
  avatar: string;
  pitch: string;
  eventId: string;
  eventName: string;
  timestamp: string;
  tags: string[];
  privateNote: string; // Encrypted locally per user
  socialLinks: Partial<SocialLinks>;
}

export interface GenesisEventItem {
  id: string;
  title: string;
  tagline: string;
  category: 'hackathon' | 'meetup' | 'workshop' | 'demo_day';
  date: string;
  location: string;
  participantsCount: number;
  imageUrl: string;
  status: 'upcoming' | 'live' | 'completed';
  registrationUrl: string;
  agenda: string[];
}

export interface GenesisNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'announcement' | 'deadline' | 'match' | 'system';
  read: boolean;
  linkUrl?: string;
}
