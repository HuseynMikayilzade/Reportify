// Domain Repository Interface: Sync
import { Report } from '../entities/Report';
import { SyncStatus } from '../entities/SyncStatus';

export interface SyncQueueItem {
  id: string;
  entityType: 'report';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  createdAt: number;
  retryCount: number;
  lastError?: string;
}

export interface ISyncRepository {
  enqueue(entityId: string, action: SyncQueueItem['action']): Promise<void>;
  dequeue(id: string): Promise<void>;
  getPending(): Promise<SyncQueueItem[]>;
  incrementRetry(id: string, error: string): Promise<void>;
  clearAll(): Promise<void>;
  getPendingCount(): Promise<number>;
}
