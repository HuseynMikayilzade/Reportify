import { Template } from '../entities/Template';

export interface ITemplateRepository {
  getTemplateByBranch(branch: string): Promise<Template | null>;
  createTemplate(template: Template): Promise<void>;
  updateTemplate(template: Template): Promise<void>;
}
