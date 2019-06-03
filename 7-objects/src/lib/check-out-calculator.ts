import { COUNTRY_CONFIGURATIONS } from '../database/config/country-configurations';
import { PAYMENTS_CONFIGURATIONS } from '../database/config/payments-configurations';
import { CountryConfiguration } from '../models/country-configuration';
import { PaymentConfiguration } from '../models/payment-configuration';
import { ShippingCost } from '../models/shipping-cost';
import { ShoppingCart } from '../models/shopping-cart';

export class CheckOutCalculator {
  private readonly countryConfigurations : CountryConfiguration[] = COUNTRY_CONFIGURATIONS;
  private readonly paymentsConfigurations : PaymentConfiguration[] = PAYMENTS_CONFIGURATIONS;
  private readonly discountFactor = 0.9;

  constructor( private readonly shoppingCart : ShoppingCart ) { }

  public calculateShippingCosts() {
    let countryConfiguration : CountryConfiguration | undefined = this.countryConfigurations.find(
      countryConfiguration => countryConfiguration.countryName === this.shoppingCart.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = this.countryConfigurations[0];
    }
    countryConfiguration.shippingCost.forEach( shippingCost => {
      if ( this.hasShippingCost( shippingCost ) ) {
        const shippingCostAmount = this.shoppingCart.legalAmounts.total * shippingCost.factor + shippingCost.plus;
        this.shoppingCart.legalAmounts.total += shippingCostAmount;
        return;
      }
    } );
  }

  public applyPaymentMethodExtra( payment : string ) {
    const paymentConfiguration : PaymentConfiguration | undefined = this.paymentsConfigurations.find(
      paymentConfiguration => paymentConfiguration.paymentMethod === payment
    );
    if ( paymentConfiguration !== undefined ) {
      this.shoppingCart.legalAmounts.total = this.shoppingCart.legalAmounts.total * paymentConfiguration.extraFactor;
    }
  }

  public applyDiscount() {
    if ( this.hasDiscount() ) {
      this.shoppingCart.legalAmounts.total *= this.discountFactor;
    }
  }

  private hasShippingCost( shippingCost : ShippingCost ) {
    return this.shoppingCart.legalAmounts.total < shippingCost.upTo;
  }

  private hasDiscount() {
    return this.shoppingCart.client.isVip || this.hasCountryDiscount();
  }

  private hasCountryDiscount() {
    let countryConfiguration : CountryConfiguration | undefined = this.countryConfigurations.find(
      countryConfiguration => countryConfiguration.countryName === this.shoppingCart.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = this.countryConfigurations[0];
    }
    return this.shoppingCart.legalAmounts.total > countryConfiguration.thresholdForDiscount;
  }
}
