import { ISyncRepository } from '../../repositories/ISyncRepository';

export interface SyncStatusResult {
  pendingCount: number;
}

export class GetSyncStatusUseCase {
  constructor(private syncRepository: ISyncRepository) {}

  async execute(): Promise<SyncStatusResult> {
    const pendingItems = await this.syncRepository.getPending();
    return {
      pendingCount: pendingItems.length,
    };
  }
}
