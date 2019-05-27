import { ShippingCost } from './ShippingCost';
export interface CountryConfiguration {
  contryName : string;
  thresholdForDiscount : number;
  shippingCost : ShippingCost[];
}
