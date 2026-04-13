import { databaseManager } from '../database/DatabaseManager';
import { Tables } from '../database/schemas';
import { ExpenseDTO } from '../dto/ExpenseDTO';

export class ExpenseLocalDataSource {
  async getExpenses(): Promise<ExpenseDTO[]> {
    const db = await databaseManager.getDb();
    return db.getAllAsync<ExpenseDTO>(`SELECT * FROM ${Tables.EXPENSES}`);
  }

  async getExpenseById(id: string): Promise<ExpenseDTO | null> {
    const db = await databaseManager.getDb();
    return db.getFirstAsync<ExpenseDTO>(
      `SELECT * FROM ${Tables.EXPENSES} WHERE id = ?`,
      [id]
    );
  }

  async createExpense(dto: ExpenseDTO): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync(
      `INSERT INTO ${Tables.EXPENSES} (id, name, description_required, is_active)
       VALUES (?, ?, ?, ?)`,
      [dto.id, dto.name, dto.description_required, dto.is_active]
    );
  }

  async updateExpense(dto: ExpenseDTO): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync(
      `UPDATE ${Tables.EXPENSES}
       SET name = ?, description_required = ?, is_active = ?
       WHERE id = ?`,
      [dto.name, dto.description_required, dto.is_active, dto.id]
    );
  }

  async deleteExpense(id: string): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync(`DELETE FROM ${Tables.EXPENSES} WHERE id = ?`, [id]);
  }
}
