// DTOs — Data Transfer Objects (raw DB row shapes)

export interface UserDTO {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  branch: string | null;
  created_at: number;
  updated_at: number;
}

export interface ReportDTO {
  id: string;
  user_id: string;
  user_full_name: string;
  branch: string | null;
  shift: string;
  notes: string | null;
  sync_status: string;
  created_at: number;
  updated_at: number;
}

export interface ReportStockDTO {
  report_id: string;
  product_id: string;
  received_qty: number;
  delivered_qty: number;
  // Included from JOIN
  product_name?: string;
}

export interface ReportSalesDTO {
  report_id: string;
  product_id: string;
  quantity: number;
  // Included from JOIN
  product_name?: string;
  price?: number;
}

export interface ReportExpenseDTO {
  id: string;
  report_id: string;
  name: string;
  amount: number;
  description: string | null;
}

export interface SyncQueueItemDTO {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  created_at: number;
  retry_count: number;
  last_error: string | null;
}
