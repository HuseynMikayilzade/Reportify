// Sync Queue Repository Implementation
import { ISyncRepository, SyncQueueItem } from '../../domain/repositories/ISyncRepository';
import { databaseManager } from '../database/DatabaseManager';
import { SyncQueueItemDTO } from '../dto/DTOs';
import { SyncMapper } from '../mappers/Mappers';
import { generateId } from '../../utils/uuid';

export class SyncRepository implements ISyncRepository {
  async enqueue(entityId: string, action: SyncQueueItem['action']): Promise<void> {
    const db = await databaseManager.getDb();
    const id = generateId();
    await db.runAsync(
      `INSERT INTO sync_queue (id, entity_type, entity_id, action, created_at, retry_count) VALUES (?, ?, ?, ?, ?, 0)`,
      [id, 'report', entityId, action, Date.now()],
    );
  }

  async dequeue(id: string): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
  }

  async getPending(): Promise<SyncQueueItem[]> {
    const db = await databaseManager.getDb();
    const dtos = await db.getAllAsync<SyncQueueItemDTO>(
      'SELECT * FROM sync_queue ORDER BY created_at ASC',
    );
    return dtos.map(SyncMapper.toDomain);
  }

  async incrementRetry(id: string, error: string): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync(
      'UPDATE sync_queue SET retry_count = retry_count + 1, last_error = ? WHERE id = ?',
      [error, id],
    );
  }

  async clearAll(): Promise<void> {
    const db = await databaseManager.getDb();
    await db.runAsync('DELETE FROM sync_queue');
  }

  async getPendingCount(): Promise<number> {
    const db = await databaseManager.getDb();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sync_queue',
    );
    return result?.count ?? 0;
  }
}
