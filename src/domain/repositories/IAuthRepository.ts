// Domain Repository Interface: Auth
import { User } from '../entities/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  persistSession(user: User): Promise<void>;
  clearSession(): Promise<void>;
}
