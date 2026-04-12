export interface TemplateDTO {
  id: string;
  branch: string;
  name: string;
}

export interface TemplateProductDTO {
  template_id: string;
  product_id: string;
}

export interface TemplateExpenseDTO {
  id: string;
  template_id: string;
  name: string;
  require_description: number;
}
