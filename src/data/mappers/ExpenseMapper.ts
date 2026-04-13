import { Expense } from '../../domain/entities/Expense';
import { ExpenseDTO } from '../dto/ExpenseDTO';

export class ExpenseMapper {
  static toDomain(dto: ExpenseDTO): Expense {
    return {
      id: dto.id,
      name: dto.name,
      descriptionRequired: dto.description_required === 1,
      isActive: dto.is_active === 1,
    };
  }

  static toDTO(domain: Expense): ExpenseDTO {
    return {
      id: domain.id,
      name: domain.name,
      description_required: domain.descriptionRequired ? 1 : 0,
      is_active: domain.isActive ? 1 : 0,
    };
  }
}
