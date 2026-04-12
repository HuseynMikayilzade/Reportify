import { IReportRepository, CreateReportInput, ReportFilters } from '../../domain/repositories/IReportRepository';
import { Report } from '../../domain/entities/Report';
import { SyncStatus } from '../../domain/entities/SyncStatus';
import { databaseManager } from '../database/DatabaseManager';
import { ReportDTO, ReportStockDTO, ReportSalesDTO, ReportExpenseDTO } from '../dto/DTOs';
import { ReportMapper } from '../mappers/Mappers';
import { generateId } from '../../utils/uuid';
import { startOfTodayMs, endOfTodayMs } from '../../utils/dates';
import { Tables } from '../database/schemas';
import * as SQLite from 'expo-sqlite';

export class ReportRepository implements IReportRepository {
  private async getRelations(db: SQLite.SQLiteDatabase, reportId: string) {
    const stockDTOs = await db.getAllAsync<ReportStockDTO>(
      `SELECT rs.*, p.name as product_name 
       FROM ${Tables.REPORT_STOCK} rs 
       LEFT JOIN ${Tables.PRODUCTS} p ON rs.product_id = p.id 
       WHERE rs.report_id = ?`,
      [reportId]
    );

    const salesDTOs = await db.getAllAsync<ReportSalesDTO>(
      `SELECT rs.*, p.name as product_name, p.price as price
       FROM ${Tables.REPORT_SALES} rs 
       LEFT JOIN ${Tables.PRODUCTS} p ON rs.product_id = p.id 
       WHERE rs.report_id = ?`,
      [reportId]
    );

    const expensesDTOs = await db.getAllAsync<ReportExpenseDTO>(
      `SELECT * FROM ${Tables.REPORT_EXPENSES} WHERE report_id = ?`,
      [reportId]
    );

    return { stockDTOs, salesDTOs, expensesDTOs };
  }

  async create(input: CreateReportInput): Promise<Report> {
    const db = await databaseManager.getDb();
    const id = generateId();
    const now = Date.now();

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO ${Tables.REPORTS} (id, user_id, user_full_name, branch, shift, notes, sync_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, input.userId, input.userFullName, input.branch ?? null, input.shift, input.notes ?? null, SyncStatus.Pending, now, now],
      );

      for (const s of input.stock) {
        await db.runAsync(
          `INSERT INTO ${Tables.REPORT_STOCK} (report_id, product_id, received_qty, delivered_qty) VALUES (?, ?, ?, ?)`,
          [id, s.productId, s.receivedQty, s.deliveredQty]
        );
      }

      for (const s of input.sales) {
        await db.runAsync(
          `INSERT INTO ${Tables.REPORT_SALES} (report_id, product_id, quantity) VALUES (?, ?, ?)`,
          [id, s.productId, s.quantity]
        );
      }

      for (const e of input.expenses) {
        await db.runAsync(
          `INSERT INTO ${Tables.REPORT_EXPENSES} (id, report_id, name, amount, description) VALUES (?, ?, ?, ?, ?)`,
          [generateId(), id, e.name, e.amount, e.description ?? null]
        );
      }
    });

    return this.getById(id) as Promise<Report>;
  }

  async getById(id: string): Promise<Report | null> {
    const db = await databaseManager.getDb();
    const dto = await db.getFirstAsync<ReportDTO>(`SELECT * FROM ${Tables.REPORTS} WHERE id = ?`, [id]);
    if (!dto) return null;
    
    const { stockDTOs, salesDTOs, expensesDTOs } = await this.getRelations(db, id);
    return ReportMapper.toDomain(dto, stockDTOs, salesDTOs, expensesDTOs);
  }

  async getAll(filters?: ReportFilters): Promise<Report[]> {
    const db = await databaseManager.getDb();
    let query = `SELECT * FROM ${Tables.REPORTS} WHERE 1=1`;
    const params: (string | number)[] = [];

    if (filters?.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }
    if (filters?.syncStatus) {
      query += ' AND sync_status = ?';
      params.push(filters.syncStatus);
    }
    if (filters?.fromDate !== undefined) {
      query += ' AND created_at >= ?';
      params.push(filters.fromDate);
    }
    if (filters?.toDate !== undefined) {
      query += ' AND created_at <= ?';
      params.push(filters.toDate);
    }

    query += ' ORDER BY created_at DESC';

    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    if (filters?.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const dtos = await db.getAllAsync<ReportDTO>(query, params);
    
    const reports: Report[] = [];
    for (const dto of dtos) {
      const { stockDTOs, salesDTOs, expensesDTOs } = await this.getRelations(db, dto.id);
      reports.push(ReportMapper.toDomain(dto, stockDTOs, salesDTOs, expensesDTOs));
    }
    return reports;
  }

  async updateSyncStatus(id: string, status: SyncStatus): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync(
      `UPDATE ${Tables.REPORTS} SET sync_status = ?, updated_at = ? WHERE id = ?`,
      [status, Date.now(), id],
    );
  }

  async delete(id: string): Promise<void> {
    const db = await databaseManager.getDb();
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM ${Tables.REPORT_STOCK} WHERE report_id = ?`, [id]);
      await db.runAsync(`DELETE FROM ${Tables.REPORT_SALES} WHERE report_id = ?`, [id]);
      await db.runAsync(`DELETE FROM ${Tables.REPORT_EXPENSES} WHERE report_id = ?`, [id]);
      await db.runAsync(`DELETE FROM ${Tables.REPORTS} WHERE id = ?`, [id]);
    });
  }

  async getPendingCount(userId?: string): Promise<number> {
    const db = await databaseManager.getDb();
    let query = "SELECT COUNT(*) as count FROM reports WHERE sync_status = 'pending'";
    const params: string[] = [];
    if (userId) { query += ' AND user_id = ?'; params.push(userId); }
    const result = await db.getFirstAsync<{ count: number }>(query, params);
    return result?.count ?? 0;
  }

  async getTodayCount(userId?: string): Promise<number> {
    const db = await databaseManager.getDb();
    let query = 'SELECT COUNT(*) as count FROM reports WHERE created_at >= ? AND created_at <= ?';
    const params: (string | number)[] = [startOfTodayMs(), endOfTodayMs()];
    if (userId) { query += ' AND user_id = ?'; params.push(userId); }
    const result = await db.getFirstAsync<{ count: number }>(query, params);
    return result?.count ?? 0;
  }
}
