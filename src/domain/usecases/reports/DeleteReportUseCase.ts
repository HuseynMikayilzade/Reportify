// Use Case: Delete Report
import { IReportRepository } from '../../repositories/IReportRepository';
import { ISyncRepository } from '../../repositories/ISyncRepository';

export class DeleteReportUseCase {
  constructor(
    private reportRepo: IReportRepository,
    private syncRepo: ISyncRepository,
  ) {}

  async execute(reportId: string): Promise<void> {
    await this.reportRepo.delete(reportId);
    await this.syncRepo.enqueue(reportId, 'delete');
  }
}
