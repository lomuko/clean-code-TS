import { ICalculateCheckOut } from '../models/i-calculate-check-out';
import { ShoppingCart } from '../models/shopping-cart';
import { CheckOutCalculator } from './check-out-calculator';

export class CalculateCheckOutFactory {
  public static createCalculatorFor( shoppingCart : ShoppingCart ) : ICalculateCheckOut {
    return new CheckOutCalculator( shoppingCart );
  }
}
