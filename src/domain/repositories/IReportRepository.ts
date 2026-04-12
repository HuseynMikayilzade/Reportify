// Domain Repository Interface: Report
import { Report, Shift } from '../entities/Report';
import { SyncStatus } from '../entities/SyncStatus';

export interface CreateReportInput {
  userId: string;
  userFullName: string;
  branch?: string;
  shift: Shift;
  stock: Omit<Report['stock'][0], 'productName'>[];
  sales: Omit<Report['sales'][0], 'productName'>[];
  expenses: Omit<Report['expenses'][0], 'id'>[];
  notes?: string;
}

export interface ReportFilters {
  userId?: string;          // scope to one user (Employee view)
  syncStatus?: SyncStatus;  // filter by pending/synced
  fromDate?: number;        // Unix ms
  toDate?: number;
  limit?: number;
  offset?: number;
}

export interface IReportRepository {
  create(input: CreateReportInput): Promise<Report>;
  getById(id: string): Promise<Report | null>;
  getAll(filters?: ReportFilters): Promise<Report[]>;
  updateSyncStatus(id: string, status: SyncStatus): Promise<void>;
  delete(id: string): Promise<void>;
  getPendingCount(userId?: string): Promise<number>;
  getTodayCount(userId?: string): Promise<number>;
}
