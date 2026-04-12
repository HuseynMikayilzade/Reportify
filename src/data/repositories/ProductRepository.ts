import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { ProductLocalDataSource } from '../datasources/ProductLocalDataSource';
import { ProductMapper } from '../mappers/ProductMapper';

export class ProductRepository implements IProductRepository {
  private localDataSource: ProductLocalDataSource;

  constructor() {
    this.localDataSource = new ProductLocalDataSource();
  }

  async getProducts(): Promise<Product[]> {
    const dtos = await this.localDataSource.getProducts();
    return dtos.map(ProductMapper.toDomain);
  }

  async getProductById(id: string): Promise<Product | null> {
    const dto = await this.localDataSource.getProductById(id);
    return dto ? ProductMapper.toDomain(dto) : null;
  }

  async createProduct(product: Product): Promise<void> {
    const dto = ProductMapper.toDTO(product);
    await this.localDataSource.createProduct(dto);
  }

  async updateProduct(product: Product): Promise<void> {
    const dto = ProductMapper.toDTO(product);
    await this.localDataSource.updateProduct(dto);
  }
}
