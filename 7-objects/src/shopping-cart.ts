import { COUNTRY_CONFIGURATIONS } from './config/country-configurations';
import { PAYMENTS_CONFIGURATIONS } from './config/payments-configurations';
import { DocumentManager } from './document-manager';
import { FileManager } from './file-manager';
import { CheckOut } from './models/check-out';
import { Client } from './models/client';
import { CountryConfiguration } from './models/country-configuration';
import { LegalAmounts } from './models/legal-amounts';
import { LineItem } from './models/line-item';
import { PaymentConfiguration } from './models/payment-configuration';
import { PathManager } from './path-manager';
import { TaxCalculator } from './tax-calculator';
import { WarehouseAdministrator } from './warehouse-administrator';

export class ShoppingCart {
  constructor( private client : Client ) { }
  private static countryConfigurations : CountryConfiguration[] = COUNTRY_CONFIGURATIONS;
  private static paymentsConfigurations : PaymentConfiguration[] = PAYMENTS_CONFIGURATIONS;
  private readonly fileManager = new FileManager();
  private readonly pathManager = new PathManager();
  private readonly shoppingPrefix : string = `shopping-`;
  private readonly lastinvoiceFileName : string = `lastinvoice.txt`;
  private lineItems : LineItem[] = [];
  private checkOut : CheckOut = {
    paymentMethod: '',
    paymentId: '',
    shippingAddress: '',
    billingAddress: ''
  };
  private legalAmounts : LegalAmounts = { total: 0, shippingCost: 0, taxes: 0, invoiceNumber: 0 };

  private documentManager : DocumentManager = new DocumentManager();

  public addLineItem( purchasedItem : LineItem ) {
    this.lineItems.push( purchasedItem );
  }

  public removeLineItem( productName : string ) {
    this.lineItems = this.lineItems.filter( lineItem => lineItem.productName !== productName );
  }

  public saveToStorage() {
    this.fileManager.ensureFolder( this.pathManager.dataFolder );
    const shoppingFilePath = this.getShoppingFilePath();
    this.fileManager.writeFile( { path: shoppingFilePath, content: JSON.stringify( this.lineItems ) } );
  }

  public loadFromStorage() {
    const shoppingFilePath = this.getShoppingFilePath();
    this.lineItems = this.getLinesFromFile( shoppingFilePath, [] );
  }
  public deleteFromStorage() {
    const shoppingFilePath = this.getShoppingFilePath();
    this.fileManager.deleteFile( shoppingFilePath );
  }

  public calculateCheckOut( checkOut : CheckOut ) {
    this.setCheckOut( checkOut );
    this.calculateTotalAmount();
    this.calculateShippingCosts();
    this.applyPaymentMethodExtra( checkOut.paymentMethod );
    this.applyDiscount();
    const totalTaxInfo = {
      base: this.legalAmounts.total,
      country: this.client.country,
      region: this.client.region,
      isStudent: this.client.isStudent
    };
    this.legalAmounts.taxes += TaxCalculator.calculateTax( totalTaxInfo );
    this.setInvoiceNumber();
    this.sendOrderToWarehouse();
    this.deleteFromStorage();
  }

  public sendInvoiceToCustomer() {
    this.documentManager.sendInvoice( this );
  }

  private getShoppingFilePath() {
    const shoppingFileName = `${this.shoppingPrefix}${this.client.name}.json`;
    const shoppingFilePath = this.pathManager.join( this.pathManager.dataFolder, shoppingFileName );
    return shoppingFilePath;
  }

  private getLinesFromFile( shoppingFilePath : string, defaultValue : any ) {
    const fileContent = { path: shoppingFilePath, content: '' };
    this.fileManager.readFile( fileContent );
    if ( fileContent.content.length > 0 ) {
      return JSON.parse( fileContent.content );
    } else {
      return defaultValue;
    }
  }

  private setCheckOut( checkOut : CheckOut ) {
    this.checkOut = checkOut;
    if ( !this.hasContent( this.checkOut.billingAddress ) ) {
      if ( this.hasContent( this.checkOut.shippingAddress ) ) {
        this.checkOut.billingAddress = this.checkOut.shippingAddress;
      }
    }
    this.checkOut.billingAddress = '';
  }

  private hasContent( content? : string ) {
    return content !== undefined && content !== null && content.length > 0;
  }

  private setInvoiceNumber() {
    const invoiceNumberFileName = this.pathManager.join( this.pathManager.dataFolder, this.lastinvoiceFileName );
    const lastInvoiceNumber = this.readLastInvoiceNumber( invoiceNumberFileName );
    this.legalAmounts.invoiceNumber = lastInvoiceNumber + 1;
    this.writeLastInvoiceNumber( invoiceNumberFileName );
  }

  private writeLastInvoiceNumber( invoiceNumberFileName : string ) {
    this.fileManager.writeFile( { path: invoiceNumberFileName, content: this.legalAmounts.invoiceNumber.toString() } );
  }

  private readLastInvoiceNumber( invoiceNumberFileName : string ) {
    let lastInvoiceNumber = 0;
    const fileContent = { path: invoiceNumberFileName, content: '0' };
    this.fileManager.readFile( fileContent );
    try {
      lastInvoiceNumber = Number.parseInt( fileContent.content );
    } catch ( error ) { }
    return lastInvoiceNumber;
  }

  private applyPaymentMethodExtra( payment : string ) {
    const paymentConfiguration : PaymentConfiguration | undefined = ShoppingCart.paymentsConfigurations.find(
      paymentConfiguration => paymentConfiguration.paymentMethod === payment
    );
    if ( paymentConfiguration !== undefined ) {
      this.legalAmounts.total = this.legalAmounts.total * paymentConfiguration.extraFactor;
    }
  }

  private applyDiscount() {
    if ( this.hasDiscount() ) {
      this.legalAmounts.total *= 0.9;
    }
  }

  private hasDiscount() {
    return this.client.isVip || this.hasCountryDiscount();
  }

  private hasCountryDiscount() {
    let countryConfiguration : CountryConfiguration | undefined = ShoppingCart.countryConfigurations.find(
      countryConfiguration => countryConfiguration.countryName === this.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = ShoppingCart.countryConfigurations[0];
    }
    return this.legalAmounts.total > countryConfiguration.thresholdForDiscount;
  }

  private calculateShippingCosts() {
    let countryConfiguration : CountryConfiguration | undefined = ShoppingCart.countryConfigurations.find(
      countryConfiguration => countryConfiguration.countryName === this.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = ShoppingCart.countryConfigurations[0];
    }
    countryConfiguration.shippingCost.forEach( shippingCost => {
      if ( this.legalAmounts.total < shippingCost.upTo ) {
        const shippingCostAmount = this.legalAmounts.total * shippingCost.factor + shippingCost.plus;
        this.legalAmounts.total += shippingCostAmount;
        return;
      }
    } );
  }

  private calculateTotalAmount() {
    const warehouseAdministrator = new WarehouseAdministrator();
    this.lineItems.forEach( line => {
      this.processLineItem( warehouseAdministrator, line );
    } );
  }

  private processLineItem( warehouseAdministrator : WarehouseAdministrator, line : LineItem ) {
    line.quantity = warehouseAdministrator.updatePurchasedProduct( line );
    line.amount = line.price * line.quantity;
    this.legalAmounts.total += line.amount;
    this.addTaxesByProduct( line );
  }

  private addTaxesByProduct( line : LineItem ) {
    if ( this.hasTaxes( line ) ) {
      const lineTaxInfo = {
        base: line.amount,
        country: this.client.country,
        region: this.client.region,
        isStudent: this.client.isStudent
      };
      line.taxes = TaxCalculator.calculateTax( lineTaxInfo );
      this.legalAmounts.taxes += line.taxes;
      let lineTotal = line.amount + line.taxes;
    }
  }

  private hasTaxes( line : any ) {
    return !line.taxFree;
  }

  private sendOrderToWarehouse() {
    this.documentManager.emailOrder( this, this.client.country );
  }
}
