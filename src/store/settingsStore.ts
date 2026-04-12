import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  notificationsOn: boolean;
  autoSync: boolean;
  offlineMode: boolean;
  setNotifications: (on: boolean) => void;
  setAutoSync: (on: boolean) => void;
  setOfflineMode: (on: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsOn: true,
      autoSync: true,
      offlineMode: false,
      setNotifications: (on) => set({ notificationsOn: on }),
      setAutoSync: (on) => set({ autoSync: on }),
      setOfflineMode: (on) => set({ offlineMode: on }),
    }),
    {
      name: 'reportify-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
