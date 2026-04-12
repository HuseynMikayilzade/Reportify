import { Product } from './Product';

export interface TemplateExpense {
  id: string;
  name: string;
  requireDescription: boolean;
}

export interface Template {
  id: string;
  branch: string;
  name: string;
  products: Product[]; // Associated products
  expenses: TemplateExpense[]; // Associated expenses
}
