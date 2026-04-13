import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
  getExpenses(): Promise<Expense[]>;
  getExpenseById(id: string): Promise<Expense | null>;
  createExpense(expense: Expense): Promise<void>;
  updateExpense(expense: Expense): Promise<void>;
  deleteExpense(id: string): Promise<void>;
}
