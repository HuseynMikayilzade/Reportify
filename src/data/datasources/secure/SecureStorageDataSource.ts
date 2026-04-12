// Secure Storage Data Source — expo-secure-store wrapper
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'reportify_session';

export const SecureStorageDataSource = {
  async saveSession(userJson: string): Promise<void> {
    await SecureStore.setItemAsync(SESSION_KEY, userJson);
  },

  async getSession(): Promise<string | null> {
    return SecureStore.getItemAsync(SESSION_KEY);
  },

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};
