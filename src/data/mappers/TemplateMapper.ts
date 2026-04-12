import { Template, TemplateExpense } from '../../domain/entities/Template';
import { TemplateDTO, TemplateExpenseDTO, TemplateProductDTO } from '../dto/TemplateDTO';
import { Product } from '../../domain/entities/Product';

export class TemplateMapper {
  static toDomain(
    dto: TemplateDTO,
    products: Product[],
    expensesDTO: TemplateExpenseDTO[]
  ): Template {
    return {
      id: dto.id,
      branch: dto.branch,
      name: dto.name,
      products,
      expenses: expensesDTO.map(e => ({
        id: e.id,
        name: e.name,
        requireDescription: e.require_description === 1,
      })),
    };
  }

  static toDTO(domain: Template): { template: TemplateDTO, products: TemplateProductDTO[], expenses: TemplateExpenseDTO[] } {
    return {
      template: {
        id: domain.id,
        branch: domain.branch,
        name: domain.name,
      },
      products: domain.products.map(p => ({
        template_id: domain.id,
        product_id: p.id,
      })),
      expenses: domain.expenses.map(e => ({
        id: e.id,
        template_id: domain.id,
        name: e.name,
        require_description: e.requireDescription ? 1 : 0,
      })),
    };
  }
}
