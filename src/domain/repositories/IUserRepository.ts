// Domain Repository Interface: User
import { User } from '../entities/User';
import { UserRole } from '../entities/UserRole';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  branch?: string;
}

export interface IUserRepository {
  create(input: CreateUserInput): Promise<User>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  getByRole(role: UserRole): Promise<User[]>;
  update(id: string, data: Partial<Pick<User, 'fullName' | 'branch'>>): Promise<void>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
