import { ITemplateRepository } from '../../repositories/ITemplateRepository';
import { Template } from '../../entities/Template';

export class GetTemplateByBranchUseCase {
  constructor(private readonly templateRepository: ITemplateRepository) {}

  async execute(branch: string): Promise<Template | null> {
    return this.templateRepository.getTemplateByBranch(branch);
  }
}
