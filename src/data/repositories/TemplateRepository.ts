import { ITemplateRepository } from '../../domain/repositories/ITemplateRepository';
import { Template } from '../../domain/entities/Template';
import { TemplateLocalDataSource } from '../datasources/TemplateLocalDataSource';
import { ProductLocalDataSource } from '../datasources/ProductLocalDataSource';
import { TemplateMapper } from '../mappers/TemplateMapper';
import { ProductMapper } from '../mappers/ProductMapper';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class TemplateRepository implements ITemplateRepository {
  private localDataSource: TemplateLocalDataSource;
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.localDataSource = new TemplateLocalDataSource();
    this.productRepository = productRepository;
  }

  async getTemplateByBranch(branch: string): Promise<Template | null> {
    const templateDto = await this.localDataSource.getTemplateByBranch(branch);
    if (!templateDto) return null;

    const productLinks = await this.localDataSource.getTemplateProducts(templateDto.id);
    const expenseDtos = await this.localDataSource.getTemplateExpenses(templateDto.id);

    const products = [];
    for (const link of productLinks) {
      const p = await this.productRepository.getProductById(link.product_id);
      if (p) products.push(p);
    }

    return TemplateMapper.toDomain(templateDto, products, expenseDtos);
  }

  async createTemplate(template: Template): Promise<void> {
    const { template: dto, products, expenses } = TemplateMapper.toDTO(template);
    await this.localDataSource.saveTemplate(dto, products, expenses);
  }

  async updateTemplate(template: Template): Promise<void> {
    const { template: dto, products, expenses } = TemplateMapper.toDTO(template);
    await this.localDataSource.saveTemplate(dto, products, expenses);
  }
}
