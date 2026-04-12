// Use Cases: Statistics
import { IReportRepository } from '../../repositories/IReportRepository';
import { Report } from '../../entities/Report';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export interface DayCount {
  date: string;
  count: number;
}

export interface StatsResult {
  total: number;
  syncedCount: number;
  pendingCount: number;
  syncRate: number;
  byDay: DayCount[];
}

function countByDate(reports: Report[], day: Date): number {
  return reports.filter((r) => format(new Date(r.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length;
}

export class GetDailyStatsUseCase {
  constructor(private reportRepo: IReportRepository) {}
  async execute(userId?: string): Promise<StatsResult> {
    const now = new Date();
    const reports = await this.reportRepo.getAll({ userId, fromDate: startOfDay(now).getTime(), toDate: endOfDay(now).getTime() });
    const synced = reports.filter((r) => r.syncStatus === 'synced').length;
    return {
      total: reports.length,
      syncedCount: synced,
      pendingCount: reports.length - synced,
      syncRate: reports.length > 0 ? Math.round((synced / reports.length) * 100) : 0,
      byDay: [{ date: format(now, 'EEE'), count: reports.length }],
    };
  }
}

export class GetWeeklyStatsUseCase {
  constructor(private reportRepo: IReportRepository) {}
  async execute(userId?: string): Promise<StatsResult> {
    const now = new Date();
    const from = startOfWeek(now, { weekStartsOn: 1 });
    const to = endOfWeek(now, { weekStartsOn: 1 });
    const reports = await this.reportRepo.getAll({ userId, fromDate: from.getTime(), toDate: to.getTime() });
    const synced = reports.filter((r) => r.syncStatus === 'synced').length;
    const days = eachDayOfInterval({ start: from, end: to });
    const byDay: DayCount[] = days.map((day) => ({ date: format(day, 'EEE'), count: countByDate(reports, day) }));
    return {
      total: reports.length,
      syncedCount: synced,
      pendingCount: reports.length - synced,
      syncRate: reports.length > 0 ? Math.round((synced / reports.length) * 100) : 0,
      byDay,
    };
  }
}

export class GetMonthlyStatsUseCase {
  constructor(private reportRepo: IReportRepository) {}
  async execute(userId?: string): Promise<StatsResult> {
    const now = new Date();
    const from = startOfMonth(now);
    const to = endOfMonth(now);
    const reports = await this.reportRepo.getAll({ userId, fromDate: from.getTime(), toDate: to.getTime() });
    const synced = reports.filter((r) => r.syncStatus === 'synced').length;
    const byDay: DayCount[] = Array.from({ length: 4 }, (_, i) => ({
      date: `W${i + 1}`,
      count: reports.filter((r) => Math.floor((new Date(r.createdAt).getDate() - 1) / 7) === i).length,
    }));
    return {
      total: reports.length,
      syncedCount: synced,
      pendingCount: reports.length - synced,
      syncRate: reports.length > 0 ? Math.round((synced / reports.length) * 100) : 0,
      byDay,
    };
  }
}
