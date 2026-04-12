import { databaseManager } from '../database/DatabaseManager';
import { Tables } from '../database/schemas';
import { TemplateDTO, TemplateExpenseDTO, TemplateProductDTO } from '../dto/TemplateDTO';

export class TemplateLocalDataSource {
  async getTemplateByBranch(branch: string): Promise<TemplateDTO | null> {
    const db = await databaseManager.getDb();
    return db.getFirstAsync<TemplateDTO>(
      `SELECT * FROM ${Tables.TEMPLATES} WHERE branch = ?`,
      [branch]
    );
  }

  async getTemplateProducts(templateId: string): Promise<TemplateProductDTO[]> {
    const db = await databaseManager.getDb();
    return db.getAllAsync<TemplateProductDTO>(
      `SELECT * FROM ${Tables.TEMPLATE_PRODUCTS} WHERE template_id = ?`,
      [templateId]
    );
  }

  async getTemplateExpenses(templateId: string): Promise<TemplateExpenseDTO[]> {
    const db = await databaseManager.getDb();
    return db.getAllAsync<TemplateExpenseDTO>(
      `SELECT * FROM ${Tables.TEMPLATE_EXPENSES} WHERE template_id = ?`,
      [templateId]
    );
  }

  async saveTemplate(template: TemplateDTO, products: TemplateProductDTO[], expenses: TemplateExpenseDTO[]): Promise<void> {
    const db = await databaseManager.getDb();
    await db.withTransactionAsync(async () => {
      // Upsert Template
      await db.runAsync(
        `INSERT INTO ${Tables.TEMPLATES} (id, branch, name) VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET branch = excluded.branch, name = excluded.name`,
        [template.id, template.branch, template.name]
      );
      
      // Delete existing relations
      await db.runAsync(`DELETE FROM ${Tables.TEMPLATE_PRODUCTS} WHERE template_id = ?`, [template.id]);
      await db.runAsync(`DELETE FROM ${Tables.TEMPLATE_EXPENSES} WHERE template_id = ?`, [template.id]);

      // Insert products
      for (const p of products) {
        await db.runAsync(
          `INSERT INTO ${Tables.TEMPLATE_PRODUCTS} (template_id, product_id) VALUES (?, ?)`,
          [p.template_id, p.product_id]
        );
      }

      // Insert expenses
      for (const e of expenses) {
        await db.runAsync(
          `INSERT INTO ${Tables.TEMPLATE_EXPENSES} (id, template_id, name, require_description) VALUES (?, ?, ?, ?)`,
          [e.id, e.template_id, e.name, e.require_description]
        );
      }
    });
  }
}
