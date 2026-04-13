import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { Expense } from '../../domain/entities/Expense';
import { ExpenseLocalDataSource } from '../datasources/ExpenseLocalDataSource';
import { ExpenseMapper } from '../mappers/ExpenseMapper';

export class ExpenseRepository implements IExpenseRepository {
  private localDataSource: ExpenseLocalDataSource;

  constructor() {
    this.localDataSource = new ExpenseLocalDataSource();
  }

  async getExpenses(): Promise<Expense[]> {
    const dtos = await this.localDataSource.getExpenses();
    return dtos.map(ExpenseMapper.toDomain);
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    const dto = await this.localDataSource.getExpenseById(id);
    return dto ? ExpenseMapper.toDomain(dto) : null;
  }

  async createExpense(expense: Expense): Promise<void> {
    const dto = ExpenseMapper.toDTO(expense);
    await this.localDataSource.createExpense(dto);
  }

  async updateExpense(expense: Expense): Promise<void> {
    const dto = ExpenseMapper.toDTO(expense);
    await this.localDataSource.updateExpense(dto);
  }

  async deleteExpense(id: string): Promise<void> {
    await this.localDataSource.deleteExpense(id);
  }
}
