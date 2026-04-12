// Use Case: Login
import { IAuthRepository, LoginCredentials } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';

export class LoginUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    if (!credentials.email.trim()) {
      throw new Error('Email is required');
    }
    if (!credentials.password.trim()) {
      throw new Error('Password is required');
    }
    const user = await this.authRepo.login(credentials);
    await this.authRepo.persistSession(user);
    return user;
  }
}
