// Auth Repository Implementation
import { IAuthRepository, LoginCredentials } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { databaseManager } from '../database/DatabaseManager';
import { UserDTO } from '../dto/DTOs';
import { UserMapper } from '../mappers/Mappers';
import { verifyPassword } from '../../utils/crypto';
import { SecureStorageDataSource } from '../datasources/secure/SecureStorageDataSource';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    const db = await databaseManager.getDb();
    const userDto = await db.getFirstAsync<UserDTO>(
      'SELECT * FROM users WHERE email = ?',
      [credentials.email.trim().toLowerCase()],
    );

    if (!userDto) {
      throw new Error('Invalid email or password');
    }

    const isValid = await verifyPassword(credentials.password, userDto.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    return UserMapper.toDomain(userDto);
  }

  async logout(): Promise<void> {
    // No server-side session to invalidate in v1.0
  }

  async getCurrentUser(): Promise<User | null> {
    const json = await SecureStorageDataSource.getSession();
    if (!json) return null;
    try {
      return JSON.parse(json) as User;
    } catch {
      return null;
    }
  }

  async persistSession(user: User): Promise<void> {
    await SecureStorageDataSource.saveSession(JSON.stringify(user));
  }

  async clearSession(): Promise<void> {
    await SecureStorageDataSource.clearSession();
  }
}
