// Domain Entity: Report
import { SyncStatus } from './SyncStatus';

export type Shift = 'Morning' | 'Afternoon' | 'Evening';

export interface ReportStock {
  productId: string;
  productName?: string;
  receivedQty: number;
  deliveredQty: number;
}

export interface ReportSale {
  productId: string;
  productName?: string;
  quantity: number;
  price?: number; 
}

export interface ReportExpense {
  id: string; // generated uuid
  name: string;
  amount: number;
  description?: string;
}

export interface Report {
  id: string;
  userId: string;
  userFullName: string;
  branch?: string; // Add branch to identify where it belongs
  shift: Shift;
  stock: ReportStock[];
  sales: ReportSale[];
  expenses: ReportExpense[];
  notes?: string;
  syncStatus: SyncStatus;
  createdAt: number; // Unix timestamp ms
  updatedAt: number;
}
