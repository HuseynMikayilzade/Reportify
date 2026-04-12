// Use Case: Sync Reports
import { ISyncRepository } from '../../repositories/ISyncRepository';
import { IReportRepository } from '../../repositories/IReportRepository';
import { SyncStatus } from '../../entities/SyncStatus';

export interface SyncResult {
  synced: number;
  failed: number;
}

export class SyncReportsUseCase {
  constructor(
    private syncRepo: ISyncRepository,
    private reportRepo: IReportRepository,
  ) {}

  async execute(): Promise<SyncResult> {
    const pending = await this.syncRepo.getPending();
    let synced = 0;
    let failed = 0;

    for (const item of pending) {
      try {
        if (item.action === 'create' || item.action === 'update') {
          await this.reportRepo.updateSyncStatus(item.entityId, SyncStatus.Synced);
        }
        await this.syncRepo.dequeue(item.id);
        synced++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        await this.syncRepo.incrementRetry(item.id, errorMsg);
        await this.reportRepo.updateSyncStatus(item.entityId, SyncStatus.Failed);
        failed++;
      }
    }

    return { synced, failed };
  }
}
