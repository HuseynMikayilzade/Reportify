import { Product } from '../entities/Product';

export interface IProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Product): Promise<void>;
  updateProduct(product: Product): Promise<void>;
}
