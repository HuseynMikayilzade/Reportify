// Seed Users — initial data on first app launch
import * as SQLite from 'expo-sqlite';
import { UserRole } from '../../domain/entities/UserRole';
import { generateId } from '../../utils/uuid';
import { hashPassword } from '../../utils/crypto';

export async function seedUsers(db: SQLite.SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users',
  );
  if (existing && existing.count > 0) return; // already seeded

  const now = Date.now();
  const seeds = [
    {
      id: generateId(),
      email: 'superadmin@reportify.app',
      passwordHash: await hashPassword('Super@123'),
      fullName: 'Super Admin',
      role: UserRole.SuperAdmin,
      branch: null,
    },
    {
      id: generateId(),
      email: 'admin@reportify.app',
      passwordHash: await hashPassword('Admin@123'),
      fullName: 'Ahmad Karimov',
      role: UserRole.Admin,
      branch: 'Central Branch',
    },
    {
      id: generateId(),
      email: 'employee@reportify.app',
      passwordHash: await hashPassword('Employee@123'),
      fullName: 'Murad Aliyev',
      role: UserRole.Employee,
      branch: 'Central Branch',
    },
    {
      id: generateId(),
      email: 'employee2@reportify.app',
      passwordHash: await hashPassword('Employee@123'),
      fullName: 'Nigar Hasanova',
      role: UserRole.Employee,
      branch: 'North Branch',
    },
  ];

  for (const user of seeds) {
    await db.runAsync(
      `INSERT INTO users (id, email, password_hash, full_name, role, branch, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.email, user.passwordHash, user.fullName, user.role, user.branch, now, now],
    );
  }
}
