// Use Case: Get Reports
import { IReportRepository, ReportFilters } from '../../repositories/IReportRepository';
import { Report } from '../../entities/Report';

export class GetReportsUseCase {
  constructor(private reportRepo: IReportRepository) {}

  async execute(filters?: ReportFilters): Promise<Report[]> {
    return this.reportRepo.getAll(filters);
  }
}
