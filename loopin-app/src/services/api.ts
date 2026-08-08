import { initialGenesisEvents, initialNotifications } from './initialData';
import type { GenesisEventItem, GenesisNotification } from '../types';

/**
 * Placeholder API service for fetching events and notifications.
 * In Phase 2, these will be replaced with real fetch() calls to the backend.
 */

export const getEvents = async (): Promise<GenesisEventItem[]> => {
  // Simulate network delay to ensure async rendering works correctly
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialGenesisEvents);
    }, 200);
  });
};

export const getNotifications = async (): Promise<GenesisNotification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialNotifications);
    }, 200);
  });
};
