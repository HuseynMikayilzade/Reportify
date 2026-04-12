// Domain Entity: User
import { UserRole } from './UserRole';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  branch?: string;
  createdAt: number; // Unix timestamp
  updatedAt: number;
}
