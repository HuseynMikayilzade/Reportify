import { databaseManager } from '../database/DatabaseManager';
import { Tables } from '../database/schemas';
import { ProductDTO } from '../dto/ProductDTO';

export class ProductLocalDataSource {
  async getProducts(): Promise<ProductDTO[]> {
    const db = await databaseManager.getDb();
    return db.getAllAsync<ProductDTO>(`SELECT * FROM ${Tables.PRODUCTS}`);
  }

  async getProductById(id: string): Promise<ProductDTO | null> {
    const db = await databaseManager.getDb();
    return db.getFirstAsync<ProductDTO>(
      `SELECT * FROM ${Tables.PRODUCTS} WHERE id = ?`,
      [id]
    );
  }

  async createProduct(dto: ProductDTO): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync(
      `INSERT INTO ${Tables.PRODUCTS} (id, name, product_type, category, price, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [dto.id, dto.name, dto.product_type, dto.category, dto.price, dto.is_active]
    );
  }

  async updateProduct(dto: ProductDTO): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync(
      `UPDATE ${Tables.PRODUCTS}
       SET name = ?, product_type = ?, category = ?, price = ?, is_active = ?
       WHERE id = ?`,
      [dto.name, dto.product_type, dto.category, dto.price, dto.is_active, dto.id]
    );
  }
}
