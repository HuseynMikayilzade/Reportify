export interface ExpenseDTO {
  id: string;
  name: string;
  description_required: number; // SQLite boolean
  is_active: number; // SQLite boolean
}
