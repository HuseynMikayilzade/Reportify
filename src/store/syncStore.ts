// Sync Store — Zustand
import { create } from 'zustand';
import { SyncRepository } from '../data/repositories/SyncRepository';
import { ReportRepository } from '../data/repositories/ReportRepository';
import { SyncReportsUseCase, SyncResult } from '../domain/usecases/sync/SyncReportsUseCase';

interface SyncState {
  isSyncing: boolean;
  lastSyncAt: number | null;
  pendingCount: number;
  lastResult: SyncResult | null;
  sync: () => Promise<SyncResult>;
  refreshPendingCount: () => Promise<void>;
}

const syncRepo = new SyncRepository();
const reportRepo = new ReportRepository();
const syncReportsUseCase = new SyncReportsUseCase(syncRepo, reportRepo);

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  lastSyncAt: null,
  pendingCount: 0,
  lastResult: null,

  sync: async () => {
    set({ isSyncing: true });
    try {
      const result = await syncReportsUseCase.execute();
      const pending = await syncRepo.getPendingCount();
      set({ isSyncing: false, lastSyncAt: Date.now(), pendingCount: pending, lastResult: result });
      return result;
    } catch {
      set({ isSyncing: false });
      return { synced: 0, failed: 0 };
    }
  },

  refreshPendingCount: async () => {
    const count = await syncRepo.getPendingCount();
    set({ pendingCount: count });
  },
}));
