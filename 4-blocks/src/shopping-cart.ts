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
    if ( this.notExistsDataFolder() ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data' ) );
    }
    const shoppingFileName = `${this.shoppingPrefix}${this.clientName}.json`;
    if ( this.notExitsFileInDataFolder( shoppingFileName ) ) {
      fs.writeFileSync( path.join( path.join( __dirname, '..', 'data' ), shoppingFileName ), JSON.stringify( this.lineItems ) );
    }
  }

  private notExitsFileInDataFolder( shoppingFileName : string ) {
    return !fs.existsSync( path.join( path.join( __dirname, '..', 'data' ), shoppingFileName ) );
  }

  private notExistsDataFolder() {
    return !fs.existsSync( path.join( __dirname, '..', 'data' ) );
  }

  public loadFromStorage() {
    const shoppingFileName = `${this.shoppingPrefix}${this.clientName}.json`;
    if ( this.exitsFileInDataFolder( shoppingFileName ) ) {
      this.readLineItemsFromFile( shoppingFileName );
    }
  }

  private readLineItemsFromFile( shoppingFileName : string ) {
    const file = fs.readFileSync( path.join( path.join( __dirname, '..', 'data' ), shoppingFileName ), 'utf8' );
    this.lineItems = JSON.parse( file );
  }

  private exitsFileInDataFolder( shoppingFileName : string ) {
    return fs.existsSync( path.join( path.join( __dirname, '..', 'data' ), shoppingFileName ) );
  }

  public deleteFromStorage() {
    const shoppingFileName = `${this.shoppingPrefix}${this.clientName}.json`;
    if ( this.exitsFileInDataFolder( shoppingFileName ) ) {
      const fileName = path.join( path.join( __dirname, '..', 'data' ), shoppingFileName );
      fs.unlinkSync( fileName );
    }
  }

  public calculateCheckOut( paymentMethod : string, paymentId : string, shippingAddress : string, billingAddress? : string ) {
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress || shippingAddress;
    this.paymentMethod = paymentMethod;
    this.paymentId = paymentId;

    this.calculateTotalAmount();

    this.calculateShippingCosts();

    this.applyPaymentMethodExtra( paymentMethod );

    this.applyDiscount();

    this.taxesAmount += TaxCalculator.calculateTotal( this.totalAmount, this.country, this.region, this.isStudent );

    this.setInvoiceNumber();
    const orderMessage = this.documentManager.getOrderMessage( this );
    this.documentManager.sendEmailOrder( this, orderMessage, this.country );
    this.deleteFromStorage();
  }

  private setInvoiceNumber() {
    const invoiceNumberFileName = path.join( path.join( __dirname, '..', 'data' ), this.lastinvoiceFileName );
    let lastInvoiceNumber = 0;
    if ( this.existsInvoiceNumbersFile( invoiceNumberFileName ) ) {
      lastInvoiceNumber = this.readLastInvoiceFromFile( invoiceNumberFileName, lastInvoiceNumber );
    }
    this.invoiceNumber = lastInvoiceNumber + 1;
    fs.writeFileSync( invoiceNumberFileName, this.invoiceNumber );
  }

  private existsInvoiceNumbersFile( invoiceNumberFileName : string ) {
    return fs.existsSync( invoiceNumberFileName );
  }

  private readLastInvoiceFromFile( invoiceNumberFileName : string, lastInvoiceNumber : number ) {
    try {
      const savedInvoiceNumber = fs.readFileSync( invoiceNumberFileName, 'utf8' );
      lastInvoiceNumber = Number.parseInt( savedInvoiceNumber );
    } catch ( error ) {
      lastInvoiceNumber = 0;
    }
    return lastInvoiceNumber;
  }

  private applyPaymentMethodExtra( payment : string ) {
    if ( this.hasPaymentMethodExtra( payment ) ) {
      this.totalAmount = this.totalAmount * 1.05;
    }
  }

  private hasPaymentMethodExtra( payment : string ) {
    return payment === this.paymentMethodExtra;
  }

  private applyDiscount() {
    if ( this.hasDiscount() ) {
      this.totalAmount *= 0.9;
    }
  }

  private hasDiscount() {
    return (
      this.isVip ||
      ( this.totalAmount > 3000 && this.country === 'Portugal' ) ||
      ( this.totalAmount > 2000 && this.country === 'France' ) ||
      ( this.totalAmount > 1000 && this.country === 'Spain' )
    );
  }

  private calculateShippingCosts() {
    if ( this.isSmallOrder() ) {
      this.calculateShippingSmallOrders();
    } else if ( this.isMediumOrder() ) {
      this.calculateShippingMediumOrders();
    } else {
      this.calculateShippingBigOrders();
    }
    this.totalAmount += this.shippingCost;
  }

  private isMediumOrder() {
    return this.totalAmount < 1000;
  }

  private isSmallOrder() {
    return this.totalAmount < 100;
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
    this.lineItems.forEach( line => this.processLineItem( warehouseAdministrator, line ) );
  }

  private processLineItem( warehouseAdministrator : WarehouseAdministrator, line : any ) {
    warehouseAdministrator.updatePurchasedProduct( line.productName, line.quantity );
    line.totalAmount = line.price * line.quantity;
    this.totalAmount += line.totalAmount;
    this.addTaxesByProduct( line );
  }

  private addTaxesByProduct( line : any ) {
    if ( this.hasTaxes( line ) ) {
      this.calculateAndSumTaxesPerLine( line );
    }
  }

  private calculateAndSumTaxesPerLine( line : any ) {
    line.taxes = TaxCalculator.calculateLine( line, this.country, this.region, this.isStudent );
    this.taxesAmount += line.taxes;
    let lineTotal = line.totalAmount + line.taxes;
  }

  private hasTaxes( line : any ) {
    return !line.taxFree;
  }

  public sendInvoiceToCustomer() {
    this.documentManager.sendInvoice( this );
  }
}
