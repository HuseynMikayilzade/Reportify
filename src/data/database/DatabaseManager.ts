// Database Manager — SQLite connection and migration runner
import * as SQLite from 'expo-sqlite';
import {
  CREATE_USERS_TABLE,
  CREATE_REPORTS_TABLE,
  CREATE_SYNC_QUEUE_TABLE,
  CREATE_PRODUCTS_TABLE,
  CREATE_TEMPLATES_TABLE,
  CREATE_TEMPLATE_PRODUCTS_TABLE,
  CREATE_TEMPLATE_EXPENSES_TABLE,
  CREATE_REPORT_STOCK_TABLE,
  CREATE_REPORT_SALES_TABLE,
  CREATE_REPORT_EXPENSES_TABLE,
} from './schemas';
import { seedUsers } from './seed';

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;

  async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync('reportify.db');
      await this.runMigrations();
    }
    return this.db;
  }

  private async runMigrations(): Promise<void> {
    if (!this.db) return;
    await this.db.execAsync('PRAGMA journal_mode = WAL;');
    await this.db.execAsync('PRAGMA foreign_keys = ON;');
    await this.db.execAsync(CREATE_USERS_TABLE);
    await this.db.execAsync(CREATE_REPORTS_TABLE);
    await this.db.execAsync(CREATE_SYNC_QUEUE_TABLE);
    await this.db.execAsync(CREATE_PRODUCTS_TABLE);
    await this.db.execAsync(CREATE_TEMPLATES_TABLE);
    await this.db.execAsync(CREATE_TEMPLATE_PRODUCTS_TABLE);
    await this.db.execAsync(CREATE_TEMPLATE_EXPENSES_TABLE);
    await this.db.execAsync(CREATE_REPORT_STOCK_TABLE);
    await this.db.execAsync(CREATE_REPORT_SALES_TABLE);
    await this.db.execAsync(CREATE_REPORT_EXPENSES_TABLE);
    await seedUsers(this.db);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const databaseManager = new DatabaseManager();
