// Mappers — DTO ↔ Domain Entity conversions
import { UserDTO, ReportDTO, SyncQueueItemDTO } from '../dto/DTOs';
import { User } from '../../domain/entities/User';
import { Report, Shift, ReportStock, ReportSale, ReportExpense } from '../../domain/entities/Report';
import { SyncStatus } from '../../domain/entities/SyncStatus';
import { UserRole } from '../../domain/entities/UserRole';
import { SyncQueueItem } from '../../domain/repositories/ISyncRepository';

export class UserMapper {
  static toDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      fullName: dto.full_name,
      role: dto.role as UserRole,
      branch: dto.branch ?? undefined,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }
}

export class ReportMapper {
  static toDomain(
    dto: ReportDTO,
    stockDTOs: import('../dto/DTOs').ReportStockDTO[],
    salesDTOs: import('../dto/DTOs').ReportSalesDTO[],
    expensesDTOs: import('../dto/DTOs').ReportExpenseDTO[]
  ): Report {
    return {
      id: dto.id,
      userId: dto.user_id,
      userFullName: dto.user_full_name,
      branch: dto.branch ?? undefined,
      shift: dto.shift as Shift,
      stock: stockDTOs.map(s => ({
        productId: s.product_id,
        productName: s.product_name,
        receivedQty: s.received_qty,
        deliveredQty: s.delivered_qty,
      })),
      sales: salesDTOs.map(s => ({
        productId: s.product_id,
        productName: s.product_name,
        quantity: s.quantity,
        price: s.price,
      })),
      expenses: expensesDTOs.map(e => ({
        id: e.id,
        name: e.name,
        amount: e.amount,
        description: e.description ?? undefined,
      })),
      notes: dto.notes ?? undefined,
      syncStatus: dto.sync_status as SyncStatus,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }
}

export class SyncMapper {
  static toDomain(dto: SyncQueueItemDTO): SyncQueueItem {
    return {
      id: dto.id,
      entityType: dto.entity_type as 'report',
      entityId: dto.entity_id,
      action: dto.action as SyncQueueItem['action'],
      createdAt: dto.created_at,
      retryCount: dto.retry_count,
      lastError: dto.last_error ?? undefined,
    };
  }
}
