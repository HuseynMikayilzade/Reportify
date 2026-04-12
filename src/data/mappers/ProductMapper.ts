import { Product, ProductCategory, ProductType } from '../../domain/entities/Product';
import { ProductDTO } from '../dto/ProductDTO';

export class ProductMapper {
  static toDomain(dto: ProductDTO): Product {
    return {
      id: dto.id,
      name: dto.name,
      productType: dto.product_type as ProductType,
      category: dto.category as ProductCategory,
      price: dto.price,
      isActive: dto.is_active === 1,
    };
  }

  static toDTO(domain: Product): ProductDTO {
    return {
      id: domain.id,
      name: domain.name,
      product_type: domain.productType,
      category: domain.category,
      price: domain.price,
      is_active: domain.isActive ? 1 : 0,
    };
  }
}
