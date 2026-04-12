import { ITemplateRepository } from '../../repositories/ITemplateRepository';
import { Template } from '../../entities/Template';

export class CreateTemplateUseCase {
  constructor(private readonly templateRepository: ITemplateRepository) {}

  async execute(template: Template): Promise<void> {
    if (!template.branch) {
      throw new Error("Template must have a branch associated.");
    }
    
    // Check if branch already has a template, if so overwrite/update
    const existing = await this.templateRepository.getTemplateByBranch(template.branch);
    if (existing) {
      template.id = existing.id; // Override ID to update
      await this.templateRepository.updateTemplate(template);
    } else {
      await this.templateRepository.createTemplate(template);
    }
  }
}
