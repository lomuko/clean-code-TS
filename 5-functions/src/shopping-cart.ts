import * as fs from 'fs';
import * as path from 'path';
import { DocumentManager } from './document-manager';
import { TaxCalculator } from './tax-calculator';
import { WarehouseAdministrator } from './warehouse-administrator';

export class ShoppingCart {
  private readonly shoppingPrefix = `shopping-`;
  private readonly lastinvoiceFileName = `lastinvoice.txt`;
  private readonly paymentMethodExtra = 'PayPal';
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

  constructor(
    public clientName : string,
    private isStudent : boolean,
    public region : string,
    public country : string,
    public email : string,
    private isVip : boolean,
    public taxNumber? : string
  ) { }

  public addLineItem( productName : string, price : number, quantity : number, country? : string, taxFree? : boolean ) {
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

  public loadFromStorage() {
    const shoppingFilePath = this.getShoppingFilePath();
    this.lineItems = this.ensureReadFile( shoppingFilePath, [] );
  }

  public deleteFromStorage() {
    const shoppingFilePath = this.getShoppingFilePath();
    this.ensureDeleteFile( shoppingFilePath );
  }

  private ensureWriteFile( filePath : string, fileContent : string ) {
    if ( !fs.existsSync( filePath ) ) {
      fs.writeFileSync( filePath, fileContent );
    }
  }

  private getShoppingFilePath() {
    const shoppingFileName = `${this.shoppingPrefix}${this.clientName}.json`;
    const shoppingFilePath = path.join( this.dataFolder(), shoppingFileName );
    return shoppingFilePath;
  }

  private ensureDataFolder() {
    if ( !fs.existsSync( this.dataFolder() ) ) {
      fs.mkdirSync( this.dataFolder() );
    }
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

  private ensureDeleteFile( filePath : string ) {
    if ( fs.existsSync( filePath ) ) {
      fs.unlinkSync( filePath );
    }
  }

  public calculateCheckOut( paymentMethod : string, paymentId : string, shippingAddress : string, billingAddress? : string ) {
    this.setCheckOutData( shippingAddress, billingAddress, paymentMethod, paymentId );
    this.calculateTotalAmount();
    this.calculateShippingCosts();
    this.applyPaymentMethodExtra( paymentMethod );
    this.applyDiscount();
    this.taxesAmount += TaxCalculator.calculateTotal( this.totalAmount, this.country, this.region, this.isStudent );
    this.setInvoiceNumber();
    this.sendOrderToWarehouse();
    this.deleteFromStorage();
  }

  public sendInvoiceToCustomer() {
    this.documentManager.sendInvoice( this );
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
      } catch ( error ) {
        lastInvoiceNumber = 0;
      }
    }
    return lastInvoiceNumber;
  }

  private applyPaymentMethodExtra( payment : string ) {
    if ( payment === this.paymentMethodExtra ) {
      this.totalAmount = this.totalAmount * 1.05;
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
    return (
      ( this.totalAmount > 3000 && this.country === 'Portugal' ) ||
      ( this.totalAmount > 2000 && this.country === 'France' ) ||
      ( this.totalAmount > 1000 && this.country === 'Spain' )
    );
  }

  private calculateShippingCosts() {
    if ( this.totalAmount < 100 ) {
      this.calculateShippingSmallOrders();
    } else if ( this.totalAmount < 1000 ) {
      this.calculateShippingMediumOrders();
    } else {
      this.calculateShippingBigOrders();
    }
    this.totalAmount += this.shippingCost;
  }

  private calculateShippingSmallOrders() {
    switch ( this.country ) {
      case 'Spain':
        this.shippingCost = this.totalAmount * 0.1;
        break;
      case 'Portugal':
        this.shippingCost = this.totalAmount * 0.15;
        break;
      case 'France':
        this.shippingCost = this.totalAmount * 0.2;
        break;
      default:
        this.shippingCost = this.totalAmount * 0.25;
        break;
    }
  }

  private calculateShippingMediumOrders() {
    switch ( this.country ) {
      case 'Spain':
        this.shippingCost = 10;
        break;
      case 'Portugal':
        this.shippingCost = 15;
        break;
      case 'France':
        this.shippingCost = 20;
        break;
      default:
        this.shippingCost = 25;
        break;
    }
  }

  private calculateShippingBigOrders() {
    switch ( this.country ) {
      case 'Spain':
        this.shippingCost = 0;
        break;
      case 'Portugal':
        this.shippingCost = 10;
        break;
      case 'France':
        this.shippingCost = 15;
        break;
      default:
        this.shippingCost = 20;
        break;
    }
  }

  private calculateTotalAmount() {
    const warehouseAdministrator = new WarehouseAdministrator();
    this.lineItems.forEach( line => {
      this.processLineItem( warehouseAdministrator, line );
    } );
  }

  private processLineItem( warehouseAdministrator : WarehouseAdministrator, line : any ) {
    line.quantity = warehouseAdministrator.updatePurchasedProduct( line.productName, line.quantity );
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

  private dataFolder() {
    return path.join( __dirname, '..', 'data' );
  }
}
