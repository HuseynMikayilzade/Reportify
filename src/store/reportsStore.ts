// Reports Store — Zustand
import { create } from 'zustand';
import { Report, Shift } from '../domain/entities/Report';
import { SyncStatus } from '../domain/entities/SyncStatus';
import { ReportRepository } from '../data/repositories/ReportRepository';
import { SyncRepository } from '../data/repositories/SyncRepository';
import { CreateReportUseCase } from '../domain/usecases/reports/CreateReportUseCase';
import { GetReportsUseCase } from '../domain/usecases/reports/GetReportsUseCase';
import { DeleteReportUseCase } from '../domain/usecases/reports/DeleteReportUseCase';
import { ReportFilters, CreateReportInput } from '../domain/repositories/IReportRepository';

interface ReportsState {
  reports: Report[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  pendingCount: number;
  todayCount: number;
  fetchReports: (filters?: ReportFilters) => Promise<void>;
  createReport: (input: CreateReportInput) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  refreshCounts: (userId?: string) => Promise<void>;
  clearError: () => void;
}

const reportRepo = new ReportRepository();
const syncRepo = new SyncRepository();
const createReportUseCase = new CreateReportUseCase(reportRepo, syncRepo);
const getReportsUseCase = new GetReportsUseCase(reportRepo);
const deleteReportUseCase = new DeleteReportUseCase(reportRepo, syncRepo);

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  pendingCount: 0,
  todayCount: 0,

  fetchReports: async (filters?: ReportFilters) => {
    set({ isLoading: true, error: null });
    try {
      const reports = await getReportsUseCase.execute(filters);
      set({ reports, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load', isLoading: false });
    }
  },

  createReport: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      const report = await createReportUseCase.execute(input);
      set((state) => ({
        reports: [report, ...state.reports],
        isSubmitting: false,
        pendingCount: state.pendingCount + 1,
        todayCount: state.todayCount + 1,
      }));
      return report;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Submit failed', isSubmitting: false });
      throw err;
    }
  },

  deleteReport: async (id: string) => {
    try {
      await deleteReportUseCase.execute(id);
      set((state) => ({ reports: state.reports.filter((r) => r.id !== id) }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Delete failed' });
    }
  },

  refreshCounts: async (userId?: string) => {
    const pending = await reportRepo.getPendingCount(userId);
    const today = await reportRepo.getTodayCount(userId);
    set({ pendingCount: pending, todayCount: today });
  },

  clearError: () => set({ error: null }),
}));
