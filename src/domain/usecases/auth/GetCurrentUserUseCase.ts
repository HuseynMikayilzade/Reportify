// Use Case: Get Current User (session restore)
import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';

export class GetCurrentUserUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepo.getCurrentUser();
  }
}
