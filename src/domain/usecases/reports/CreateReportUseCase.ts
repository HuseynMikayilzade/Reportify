// Use Case: Create Report
import { IReportRepository, CreateReportInput } from '../../repositories/IReportRepository';
import { ISyncRepository } from '../../repositories/ISyncRepository';
import { Report } from '../../entities/Report';

export class CreateReportUseCase {
  constructor(
    private reportRepo: IReportRepository,
    private syncRepo: ISyncRepository,
  ) {}

  async execute(input: CreateReportInput): Promise<Report> {
    if (!input.shift) {
      throw new Error('Shift is required');
    }
    if (input.stock.length === 0 && input.sales.length === 0 && input.expenses.length === 0) {
      throw new Error('Report must contain at least one item (stock, sale, or expense)');
    }

    // Save locally first (offline-first)
    const report = await this.reportRepo.create(input);

    // Enqueue for sync
    await this.syncRepo.enqueue(report.id, 'create');

    return report;
  }
}
