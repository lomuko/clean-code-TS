import * as fs from 'fs';
import * as path from 'path';
import { DocumentManager } from './document-manager';
import { TaxCalculator } from './tax-calculator';
import { WarehouseAdministrator } from './warehouse-administrator';

export class ShoppingCart {
  constructor(
    public clientName : string,
    private isStudent : boolean,
    public region : string,
    public country : string,
    public email : string,
    private isVip : boolean,
    public taxNumber? : string
  ) { }
  private static countryConfigurations = [
    {
      contryName: 'Spain',
      thresholdForDiscount: 1000,
      shippingCost: [
        {
          upTo: 100,
          factor: 0.1,
          plus: 0
        },
        {
          upTo: 1000,
          factor: 0,
          plus: 10
        },
        {
          upTo: Infinity,
          factor: 0,
          plus: 0
        }
      ]
    },
    {
      contryName: 'Portugal',
      thresholdForDiscount: 3000,
      shippingCost: [
        {
          upTo: 100,
          factor: 0.15,
          plus: 0
        },
        {
          upTo: 1000,
          factor: 0,
          plus: 15
        },
        {
          upTo: Infinity,
          factor: 0,
          plus: 10
        }
      ]
    },
    {
      contryName: 'France',
      thresholdForDiscount: 2000,
      shippingCost: [
        {
          upTo: 100,
          factor: 0.2,
          plus: 0
        },
        {
          upTo: 1000,
          factor: 0,
          plus: 20
        },
        {
          upTo: Infinity,
          factor: 0,
          plus: 15
        }
      ]
    }
  ];
  private static readonly paymentsConfigurations : [
    {
      paymentMethod : 'PayPal';
      extraFactor : 1.15;
    }
  ];
  public lineItems : any[] = [];
  public totalAmount : number = 0;
  public shippingCost = 0;
  public taxesAmount : number = 0;
  public paymentMethod : string = '';
  public paymentId : string = '';
  public shippingAddress : string = '';
  public billingAddress : string = '';
  public invoiceNumber : number = 0;
  public documentManager = new DocumentManager();

  public addLineItem(
    productName : string,
    price : number,
    quantity : number,
    country? : string,
    taxFree? : boolean
  ) {
    this.lineItems.push( { productName, price, quantity } );
  }

  public removeLineItem( productName : string ) {
    this.lineItems = this.lineItems.filter( lineItem => lineItem.productName !== productName );
  }

  public saveToStorage() {
    this.ensureDataFolder();
    const shoppingFilePath = this.getShoppingFilePath();
    this.ensureWriteFile( shoppingFilePath, JSON.stringify( this.lineItems ) );
  }

  private ensureWriteFile( filePath : string, fileContent : string ) {
    if ( !fs.existsSync( filePath ) ) {
      fs.writeFileSync( filePath, fileContent );
    }
  }

  private getShoppingFilePath() {
    const shoppingFileName = `shopping-${this.clientName}.json`;
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

  public calculate(
    paymentMethod : string,
    paymentId : string,
    shippingAddress : string,
    billingAddress? : string
  ) {
    this.setCheckOutData( shippingAddress, billingAddress, paymentMethod, paymentId );
    this.calculateTotalAmount();
    this.calculateShippingCosts();
    this.applyPaymentMethodExtra( paymentMethod );
    this.applyDiscount();
    this.taxesAmount += TaxCalculator.calculateTotal(
      this.totalAmount,
      this.country,
      this.region,
      this.isStudent
    );
    this.setInvoiceNumber();
    this.sendOrderToWarehouse();
    this.deleteFromStorage();
  }

  private setCheckOutData(
    shippingAddress : string,
    billingAddress : string | undefined,
    paymentMethod : string,
    paymentId : string
  ) {
    this.shippingAddress = shippingAddress;
    this.billingAddress = this.getBillingAddress( shippingAddress, billingAddress );
    this.paymentMethod = paymentMethod;
    this.paymentId = paymentId;
  }

  private getBillingAddress( shippingAddress : string, billingAddress? : string ) : string {
    if ( this.hasContent( billingAddress ) ) {
      return billingAddress as string;
    }
    if ( this.hasContent( shippingAddress ) ) {
      return shippingAddress;
    }
    return '';
  }

  private hasContent( content? : string ) {
    return content !== undefined && content !== null && content.length > 0;
  }

  private setInvoiceNumber() {
    const invoiceNumberFileName = path.join( this.dataFolder(), `lastinvoice.txt` );
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
    const paymentConfiguration = ShoppingCart.paymentsConfigurations.find(
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
    return this.isVip || this.hasCountryDiscount();
  }

  private hasCountryDiscount() {
    const countryConfiguration = ShoppingCart.countryConfigurations.find(
      countryConfiguration => countryConfiguration.contryName === this.country
    );
    if ( countryConfiguration !== undefined ) {
      return this.totalAmount > countryConfiguration.thresholdForDiscount;
    } else {
      return false;
    }
  }

  private calculateShippingCosts() {
    const countryConfiguration = ShoppingCart.countryConfigurations.find(
      countryConfiguration => countryConfiguration.contryName === this.country
    );
    if ( countryConfiguration !== undefined ) {
      countryConfiguration.shippingCost.forEach( shippingCost => {
        if ( this.totalAmount < shippingCost.upTo ) {
          const shippingCostAmount = this.totalAmount * shippingCost.factor + shippingCost.plus;
          this.totalAmount += shippingCostAmount;
          return;
        }
      } );
    }
  }

  private calculateTotalAmount() {
    const warehouseAdministrator = new WarehouseAdministrator();
    this.lineItems.forEach( line => {
      this.processLineItem( warehouseAdministrator, line );
    } );
  }

  private processLineItem( warehouseAdministrator : WarehouseAdministrator, line : any ) {
    line.quantity = warehouseAdministrator.updateBuyedProduct( line.productName, line.quantity );
    line.totalAmount = line.price * line.quantity;
    this.totalAmount += line.totalAmount;
    this.addTaxesByProduct( line );
  }

  private addTaxesByProduct( line : any ) {
    if ( this.hasTaxes( line ) ) {
      line.taxes = TaxCalculator.calculateLine( line, this.country, this.region, this.isStudent );
      this.taxesAmount += line.taxes;
      let lineTotal = line.totalAmount + line.taxes;
    }
  }

  private hasTaxes( line : any ) {
    return !line.taxFree;
  }

  private sendOrderToWarehouse() {
    const orderMessage = this.documentManager.getOrderTemplate( this );
    this.documentManager.emailOrder( this, orderMessage, this.country );
  }

  public sendInvoiceToCustomer() {
    this.documentManager.sendInvoice( this );
  }

  private dataFolder() {
    return path.join( __dirname, '..', 'data' );
  }
}
