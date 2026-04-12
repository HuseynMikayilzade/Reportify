export type ProductCategory = 'chicken' | 'meat' | 'other';
export type ProductType = 'stock' | 'sales';

export interface Product {
  id: string;
  name: string;
  productType: ProductType;
  category: ProductCategory;
  price: number;
  isActive: boolean;
}
