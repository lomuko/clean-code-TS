import * as fs from 'fs';
import * as path from 'path';
import { COUNTRY_CONFIGURATIONS } from './config/country-configurations';
import { PAYMENTS_CONFIGURATIONS } from './config/payments-configurations';
import { DocumentManager } from './document-manager';
import { CheckOut } from './models/check-out';
import { Client } from './models/client';
import { CountryConfiguration } from './models/country-configuration';
import { FileContent } from './models/file-content';
import { LineItem } from './models/line-item';
import { PaymentConfiguration } from './models/payment-configuration';
import { TaxCalculator } from './tax-calculator';
import { WarehouseAdministrator } from './warehouse-administrator';

export class ShoppingCart {
  constructor( public client : Client ) { }
  private static countryConfigurations : CountryConfiguration[] = COUNTRY_CONFIGURATIONS;
  private static paymentsConfigurations : PaymentConfiguration[] = PAYMENTS_CONFIGURATIONS;
  private readonly shoppingPrefix : string = `shopping-`;
  private readonly lastinvoiceFileName : string = `lastinvoice.txt`;
  public lineItems : LineItem[] = [];
  public checkOut : CheckOut = {
    paymentMethod: '',
    paymentId: '',
    shippingAddress: '',
    billingAddress: ''
  };
  public totalAmount : number = 0;
  public shippingCost : number = 0;
  public taxesAmount : number = 0;
  public invoiceNumber : number = 0;
  public documentManager : DocumentManager = new DocumentManager();

  public addLineItem( purchasedItem : LineItem ) {
    this.lineItems.push( purchasedItem );
  }

  public removeLineItem( productName : string ) {
    this.lineItems = this.lineItems.filter( lineItem => lineItem.productName !== productName );
  }

  public saveToStorage() {
    this.ensureDataFolder();
    const shoppingFilePath = this.getShoppingFilePath();
    this.ensureWriteFile( { path: shoppingFilePath, content: JSON.stringify( this.lineItems ) } );
  }

  private ensureWriteFile( fileContent : FileContent ) {
    if ( !fs.existsSync( fileContent.path ) ) {
      fs.writeFileSync( fileContent.path, fileContent.content );
    }
  }

  private getShoppingFilePath() {
    const shoppingFileName = `${this.shoppingPrefix}${this.client.name}.json`;
    const shoppingFilePath = path.join( this.dataFolder(), shoppingFileName );
    return shoppingFilePath;
  }

  private ensureDataFolder() {
    if ( !fs.existsSync( this.dataFolder() ) ) {
      fs.mkdirSync( this.dataFolder() );
    }
  }

  public loadFromStorage() {
    const shoppingFilePath = this.getShoppingFilePath();
    this.lineItems = this.ensureReadFile( shoppingFilePath, [] );
  }

  private ensureReadFile( shoppingFilePath : string, defaultValue : any ) {
    if ( fs.existsSync( shoppingFilePath ) ) {
      try {
        const file = fs.readFileSync( shoppingFilePath, 'utf8' );
        return JSON.parse( file );
      } catch ( error ) {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  }

  public deleteFromStorage() {
    const shoppingFilePath = this.getShoppingFilePath();
    this.ensureDeleteFile( shoppingFilePath );
  }

  private ensureDeleteFile( filePath : string ) {
    if ( fs.existsSync( filePath ) ) {
      fs.unlinkSync( filePath );
    }
  }

  public calculateCheckOut( checkOut : CheckOut ) {
    this.setCheckOut( checkOut );
    this.calculateTotalAmount();
    this.calculateShippingCosts();
    this.applyPaymentMethodExtra( checkOut.paymentMethod );
    this.applyDiscount();
    const totalTaxInfo = {
      base: this.totalAmount,
      country: this.client.country,
      region: this.client.region,
      isStudent: this.client.isStudent
    };
    this.taxesAmount += TaxCalculator.calculateTax( totalTaxInfo );
    this.setInvoiceNumber();
    this.sendOrderToWarehouse();
    this.deleteFromStorage();
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
    const invoiceNumberFileName = path.join( this.dataFolder(), this.lastinvoiceFileName );
    const lastInvoiceNumber = this.readLastInvoiceNumber( invoiceNumberFileName );
    this.invoiceNumber = lastInvoiceNumber + 1;
    this.writeLastInvoiceNumber( invoiceNumberFileName );
  }

  private writeLastInvoiceNumber( invoiceNumberFileName : string ) {
    fs.writeFileSync( invoiceNumberFileName, this.invoiceNumber );
  }

  private readLastInvoiceNumber( invoiceNumberFileName : string ) {
    let lastInvoiceNumber = 0;
    if ( fs.existsSync( invoiceNumberFileName ) ) {
      try {
        const savedInvoiceNumber = fs.readFileSync( invoiceNumberFileName, 'utf8' );
        lastInvoiceNumber = Number.parseInt( savedInvoiceNumber );
      } catch ( error ) { }
    }
    return lastInvoiceNumber;
  }

  private applyPaymentMethodExtra( payment : string ) {
    const paymentConfiguration : PaymentConfiguration | undefined = ShoppingCart.paymentsConfigurations.find(
      paymentConfiguration => paymentConfiguration.paymentMethod === payment
    );
    if ( paymentConfiguration !== undefined ) {
      this.totalAmount = this.totalAmount * paymentConfiguration.extraFactor;
    }
  }

  private applyDiscount() {
    if ( this.hasDiscount() ) {
      this.totalAmount *= 0.9;
    }
  }

  private hasDiscount() {
    return this.client.isVip || this.hasCountryDiscount();
  }

  private hasCountryDiscount() {
    let countryConfiguration : CountryConfiguration | undefined = ShoppingCart.countryConfigurations.find(
      countryConfiguration => countryConfiguration.contryName === this.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = ShoppingCart.countryConfigurations[0];
    }
    return this.totalAmount > countryConfiguration.thresholdForDiscount;
  }

  private calculateShippingCosts() {
    let countryConfiguration : CountryConfiguration | undefined = ShoppingCart.countryConfigurations.find(
      countryConfiguration => countryConfiguration.contryName === this.client.country
    );
    if ( countryConfiguration === undefined ) {
      countryConfiguration = ShoppingCart.countryConfigurations[0];
    }
    countryConfiguration.shippingCost.forEach( shippingCost => {
      if ( this.totalAmount < shippingCost.upTo ) {
        const shippingCostAmount = this.totalAmount * shippingCost.factor + shippingCost.plus;
        this.totalAmount += shippingCostAmount;
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
    this.totalAmount += line.amount;
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
      this.taxesAmount += line.taxes;
      let lineTotal = line.amount + line.taxes;
    }
  }

  private hasTaxes( line : any ) {
    return !line.taxFree;
  }

  private sendOrderToWarehouse() {
    const orderMessage = this.documentManager.getOrderTemplate( this );
    this.documentManager.emailOrder( this, orderMessage, this.client.country );
  }

  public sendInvoiceToCustomer() {
    this.documentManager.sendInvoice( this );
  }

  private dataFolder() {
    return path.join( __dirname, '..', 'data' );
  }
}
