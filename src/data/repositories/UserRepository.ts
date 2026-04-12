import { IUserRepository, CreateUserInput } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserRole } from '../../domain/entities/UserRole';
import { databaseManager } from '../database/DatabaseManager';
import { UserDTO } from '../dto/DTOs';
import { UserMapper } from '../mappers/Mappers';
import { generateId } from '../../utils/uuid';

export class UserRepository implements IUserRepository {
  async create(input: CreateUserInput): Promise<User> {
    const db = await databaseManager.getDb();
    const id = generateId();
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO users (id, email, password_hash, full_name, role, branch, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, input.email, input.passwordHash, input.fullName, input.role, input.branch ?? null, now, now]
    );
    const dto = await db.getFirstAsync<UserDTO>('SELECT * FROM users WHERE id = ?', [id]);
    return UserMapper.toDomain(dto!);
  }

  async getById(id: string): Promise<User | null> {
    const db = await databaseManager.getDb();
    const dto = await db.getFirstAsync<UserDTO>('SELECT * FROM users WHERE id = ?', [id]);
    return dto ? UserMapper.toDomain(dto) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const db = await databaseManager.getDb();
    const dto = await db.getFirstAsync<UserDTO>('SELECT * FROM users WHERE email = ?', [email]);
    return dto ? UserMapper.toDomain(dto) : null;
  }

  async getAll(): Promise<User[]> {
    const db = await databaseManager.getDb();
    const dtos = await db.getAllAsync<UserDTO>('SELECT * FROM users ORDER BY created_at DESC');
    return dtos.map(UserMapper.toDomain);
  }

  async getByRole(role: UserRole): Promise<User[]> {
    const db = await databaseManager.getDb();
    const dtos = await db.getAllAsync<UserDTO>('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC', [role]);
    return dtos.map(UserMapper.toDomain);
  }

  async update(id: string, data: Partial<Pick<User, 'fullName' | 'branch'>>): Promise<void> {
    const db = await databaseManager.getDb();
    const now = Date.now();
    let query = 'UPDATE users SET updated_at = ?';
    const params: (string | number)[] = [now];

    if (data.fullName !== undefined) {
      query += ', full_name = ?';
      params.push(data.fullName);
    }
    if (data.branch !== undefined) {
      query += ', branch = ?';
      params.push(data.branch);
    }

    query += ' WHERE id = ?';
    params.push(id);
    await db.runAsync(query, params);
  }

  async delete(id: string): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
  }

  async count(): Promise<number> {
    const db = await databaseManager.getDb();
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM users');
    return result?.count ?? 0;
  }
}
