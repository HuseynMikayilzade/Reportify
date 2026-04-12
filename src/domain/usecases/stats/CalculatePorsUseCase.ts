import { Report } from '../../entities/Report';
import { Product } from '../../entities/Product';

export interface PorsResult {
  chicken: PorsDetail;
  meat: PorsDetail;
}

export interface PorsDetail {
  expected: number; // sales quantity
  actual: number;   // received - delivered
  difference: number; // actual - expected
}

export class CalculatePorsUseCase {
  async execute(report: Report, products: Product[]): Promise<PorsResult> {
    const result: PorsResult = {
      chicken: { expected: 0, actual: 0, difference: 0 },
      meat: { expected: 0, actual: 0, difference: 0 },
    };

    // Calculate actual (stock usage: received - delivered)
    for (const stock of report.stock) {
      const product = products.find(p => p.id === stock.productId);
      if (product) {
        if (product.category === 'chicken') {
          result.chicken.actual += (stock.receivedQty - stock.deliveredQty);
        } else if (product.category === 'meat') {
          result.meat.actual += (stock.receivedQty - stock.deliveredQty);
        }
      }
    }

    // Calculate expected (sales quantity)
    for (const sale of report.sales) {
      const product = products.find(p => p.id === sale.productId);
      if (product) {
        if (product.category === 'chicken') {
          result.chicken.expected += sale.quantity;
        } else if (product.category === 'meat') {
          result.meat.expected += sale.quantity;
        }
      }
    }

    // Calculate difference
    result.chicken.difference = result.chicken.actual - result.chicken.expected;
    result.meat.difference = result.meat.actual - result.meat.expected;

    return result;
  }
}
