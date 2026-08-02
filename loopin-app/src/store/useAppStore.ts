import { useState, useEffect } from 'react';
import type { UserProfile, ConnectionCard, GenesisEventItem, GenesisNotification, EventScope, SocialVisibility } from '../types';
import { initialActiveUser, currentEventScope, initialConnections, initialGenesisEvents, initialNotifications } from '../services/initialData';

const LOCAL_STORAGE_KEY_USER = 'loopin_user_profile';
const LOCAL_STORAGE_KEY_CONNECTIONS = 'loopin_connections';
const LOCAL_STORAGE_KEY_NOTIFS = 'loopin_notifications';
const LOCAL_STORAGE_KEY_AUTH = 'loopin_is_authenticated';

export function useAppStore() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH);
    return saved ? JSON.parse(saved) : true; // Default to true for instant MVP testing
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : initialActiveUser;
  });

  const [currentEvent] = useState<EventScope>(currentEventScope);

  const [connections, setConnections] = useState<ConnectionCard[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONNECTIONS);
    return saved ? JSON.parse(saved) : initialConnections;
  });

  const [events] = useState<GenesisEventItem[]>(initialGenesisEvents);

  const [notifications, setNotifications] = useState<GenesisNotification[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [activeTab, setActiveTab] = useState<'badge' | 'scan' | 'connections' | 'hub' | 'profile'>('badge');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannedConnection, setScannedConnection] = useState<ConnectionCard | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CONNECTIONS, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Auth actions
  const loginWithOtp = (_identifier: string, _otp: string) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Profile actions
  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const toggleSocialVisibility = (platform: keyof SocialVisibility) => {
    setUserProfile((prev) => ({
      ...prev,
      socialVisibility: {
        ...prev.socialVisibility,
        [platform]: !prev.socialVisibility[platform],
      },
    }));
  };

  // Connection actions
  const addConnection = (newConn: ConnectionCard) => {
    setConnections((prev) => [newConn, ...prev]);
    setUserProfile((prev) => ({ ...prev, totalConnections: prev.totalConnections + 1 }));
  };

  const updateConnectionNote = (id: string, note: string, tags: string[]) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, privateNote: note, tags } : c))
    );
  };

  const deleteConnection = (id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return {
    isAuthenticated,
    loginWithOtp,
    logout,
    userProfile,
    updateUserProfile,
    toggleSocialVisibility,
    currentEvent,
    connections,
    addConnection,
    updateConnectionNote,
    deleteConnection,
    events,
    notifications,
    markNotificationRead,
    activeTab,
    setActiveTab,
    isScannerOpen,
    setIsScannerOpen,
    scannedConnection,
    setScannedConnection,
  };
}
