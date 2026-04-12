// Auth Store — Zustand
import { create } from 'zustand';
import { User } from '../domain/entities/User';
import { AuthRepository } from '../data/repositories/AuthRepository';
import { LoginUseCase } from '../domain/usecases/auth/LoginUseCase';
import { LogoutUseCase } from '../domain/usecases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '../domain/usecases/auth/GetCurrentUserUseCase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

const authRepo = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepo);
const logoutUseCase = new LogoutUseCase(authRepo);
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepo);

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  initialize: async () => {
    set({ isInitializing: true });
    try {
      const user = await getCurrentUserUseCase.execute();
      set({ user, isInitializing: false });
    } catch {
      set({ user: null, isInitializing: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginUseCase.execute({ email, password });
      set({ user, isLoading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUseCase.execute();
      set({ user: null, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
