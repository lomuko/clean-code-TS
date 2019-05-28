import { ShippingCost } from './shipping-cost';
export interface CountryConfiguration {
  contryName : string;
  thresholdForDiscount : number;
  shippingCost : ShippingCost[];
}
