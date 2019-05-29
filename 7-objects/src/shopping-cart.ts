import { COUNTRY_CONFIGURATIONS } from './config/country-configurations';
import { PAYMENTS_CONFIGURATIONS } from './config/payments-configurations';
import { DocumentManager } from './document-manager';
import { FileManager } from './file-manager';
import { CheckOut } from './models/check-out';
import { Client } from './models/client';
import { CountryConfiguration } from './models/country-configuration';
import { LineItem } from './models/line-item';
import { PaymentConfiguration } from './models/payment-configuration';
import { ShoppingCart } from './models/shopping-cart';
import { PathManager } from './path-manager';
import { TaxCalculator } from './tax-calculator';
import { WarehouseAdministrator } from './warehouse-administrator';

export class ShoppingCartManager {
  constructor( client : Client ) {
    this.shoppingCart = {
      client: client,
      lineItems: [],
      checkOut: {
        paymentMethod: '',
        paymentId: '',
        shippingAddress: '',
        billingAddress: ''
      },
      legalAmounts: { total: 0, shippingCost: 0, taxes: 0, invoiceNumber: 0 }
    };
  }
  private static countryConfigurations : CountryConfiguration[] = COUNTRY_CONFIGURATIONS;
  private static paymentsConfigurations : PaymentConfiguration[] = PAYMENTS_CONFIGURATIONS;
  private readonly fileManager = new FileManager();
  private readonly pathManager = new PathManager();
  private readonly shoppingPrefix : string = `shopping-`;
  private readonly lastinvoiceFileName : string = `lastinvoice.txt`;
  private shoppingCart : ShoppingCart;

  private documentManager : DocumentManager = new DocumentManager();

  public addLineItem( purchasedItem : LineItem ) {
    this.shoppingCart.lineItems.push( purchasedItem );
  }
  public removeLineItem( productName : string ) {
    this.shoppingCart.lineItems = this.shoppingCart.lineItems.filter( lineItem => lineItem.productName !== productName );
  }

  public loadFromStorage() {
    const shoppingFilePath = this.getShoppingFilePath();
    this.shoppingCart.lineItems = this.getLinesFromFile( shoppingFilePath, [] );
  }
  public saveToStorage() {
    this.fileManager.ensureFolder( this.pathManager.dataFolder );
    const shoppingFilePath = this.getShoppingFilePath();
    this.fileManager.writeFile( { path: shoppingFilePath, content: JSON.stringify( this.shoppingCart.lineItems ) } );
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
      base: this.shoppingCart.legalAmounts.total,
      country: this.shoppingCart.client.country,
      region: this.shoppingCart.client.region,
      isStudent: this.shoppingCart.client.isStudent
    };
    this.shoppingCart.legalAmounts.taxes += TaxCalculator.calculateTax( totalTaxInfo );
    this.setInvoiceNumber();
    this.sendOrderToWarehouse();
    this.deleteFromStorage();
  }
  public sendInvoiceToCustomer() {
    this.documentManager.sendInvoice( this.shoppingCart );
  }

  private getShoppingFilePath() {
    const shoppingFileName = `${this.shoppingPrefix}${this.shoppingCart.client.name}.json`;
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
    if ( !this.hasContent( checkOut.billingAddress ) ) {
      if ( this.hasContent( checkOut.shippingAddress ) ) {
        checkOut.billingAddress = checkOut.shippingAddress;
      }
    }
    checkOut.billingAddress = '';
    this.shoppingCart.checkOut = checkOut;
  }

  private hasContent( content? : string ) {
    return content !== undefined && content !== null && content.length > 0;
  }

  private setInvoiceNumber() {
    const invoiceNumberFileName = this.pathManager.join( this.pathManager.dataFolder, this.lastinvoiceFileName );
    const lastInvoiceNumber = this.readLastInvoiceNumber( invoiceNumberFileName );
    this.shoppingCart.legalAmounts.invoiceNumber = lastInvoiceNumber + 1;
    this.writeLastInvoiceNumber( invoiceNumberFileName );
  }

  private writeLastInvoiceNumber( invoiceNumberFileName : string ) {
    this.fileManager.writeFile( {
      path: invoiceNumberFileName,
      content: this.shoppingCart.legalAmounts.invoiceNumber.toString()
    } );
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
    const paymentConfiguration : PaymentConfiguration | undefined = ShoppingCartManager.paymentsConfigurations.find(
      paymentConfiguration => paymentConfiguration.paymentMethod === payment
    );
    if ( paymentConfiguration !== undefined ) {
      this.shoppingCart.legalAmounts.total = this.shoppingCart.legalAmounts.total * paymentConfiguration.extraFactor;
    }
  }

  private applyDiscount() {
    if ( this.hasDiscount() ) {
      this.shoppingCart.legalAmounts.total *= 0.9;
    }
  }

  private hasDiscount() {
    return this.shoppingCart.client.isVip || this.hasCountryDiscount();
  }

  private hasCountryDiscount() {
    let countryConfiguration : CountryConfiguration | undefined = ShoppingCartManager.countryConfigurations.find(
      countryConfiguration => countryConfiguration.countryName === this.shoppingCart.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = ShoppingCartManager.countryConfigurations[0];
    }
    return this.shoppingCart.legalAmounts.total > countryConfiguration.thresholdForDiscount;
  }

  private calculateShippingCosts() {
    let countryConfiguration : CountryConfiguration | undefined = ShoppingCartManager.countryConfigurations.find(
      countryConfiguration => countryConfiguration.countryName === this.shoppingCart.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = ShoppingCartManager.countryConfigurations[0];
    }
    countryConfiguration.shippingCost.forEach( shippingCost => {
      if ( this.shoppingCart.legalAmounts.total < shippingCost.upTo ) {
        const shippingCostAmount = this.shoppingCart.legalAmounts.total * shippingCost.factor + shippingCost.plus;
        this.shoppingCart.legalAmounts.total += shippingCostAmount;
        return;
      }
    } );
  }

  private calculateTotalAmount() {
    const warehouseAdministrator = new WarehouseAdministrator();
    this.shoppingCart.lineItems.forEach( line => {
      this.processLineItem( warehouseAdministrator, line );
    } );
  }

  private processLineItem( warehouseAdministrator : WarehouseAdministrator, line : LineItem ) {
    line.quantity = warehouseAdministrator.updatePurchasedProduct( line );
    line.amount = line.price * line.quantity;
    this.shoppingCart.legalAmounts.total += line.amount;
    this.addTaxesByProduct( line );
  }

  private addTaxesByProduct( line : LineItem ) {
    if ( this.hasTaxes( line ) ) {
      const lineTaxInfo = {
        base: line.amount,
        country: this.shoppingCart.client.country,
        region: this.shoppingCart.client.region,
        isStudent: this.shoppingCart.client.isStudent
      };
      line.taxes = TaxCalculator.calculateTax( lineTaxInfo );
      this.shoppingCart.legalAmounts.taxes += line.taxes;
      let lineTotal = line.amount + line.taxes;
    }
  }

  private hasTaxes( line : any ) {
    return !line.taxFree;
  }

  private sendOrderToWarehouse() {
    this.documentManager.sendOrder( this.shoppingCart );
  }
}
