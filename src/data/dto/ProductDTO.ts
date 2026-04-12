export interface ProductDTO {
  id: string;
  name: string;
  product_type: string;
  category: string;
  price: number;
  is_active: number; // SQLite boolean
}
