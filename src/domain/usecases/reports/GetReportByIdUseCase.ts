import { IReportRepository } from '../../repositories/IReportRepository';
import { Report } from '../../entities/Report';

export class GetReportByIdUseCase {
  constructor(private reportRepository: IReportRepository) {}

  async execute(id: string): Promise<Report | null> {
    return this.reportRepository.getById(id);
  }
}
