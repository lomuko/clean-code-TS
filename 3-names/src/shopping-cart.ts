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
    if ( !fs.existsSync( path.join( __dirname, '..', 'data' ) ) ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data' ) );
    }
    const fileName = `${this.shoppingPrefix}${this.clientName}.json`;
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', fileName ) ) ) {
      fs.writeFileSync( path.join( __dirname, '..', 'data', fileName ), JSON.stringify( this.lineItems ) );
    }
  }

  public loadFromStorage() {
    const fileName = path.join( __dirname, '..', 'data', `${this.shoppingPrefix}${this.clientName}.json` );
    if ( fs.existsSync( fileName ) ) {
      const file = fs.readFileSync( fileName, 'utf8' );
      this.lineItems = JSON.parse( file );
    }
  }

  public deleteFromStorage() {
    const fileName = path.join( __dirname, '..', 'data', `${this.shoppingPrefix}${this.clientName}.json` );
    if ( fs.existsSync( fileName ) ) {
      fs.unlinkSync( fileName );
    }
  }

  public calculateCheckOut( payment : string, paymentId : string, shippingAddress : string, billingAddress? : string ) {
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress || shippingAddress;
    this.paymentMethod = payment;
    this.paymentId = paymentId;
    const warehouseAdministrator = new WarehouseAdministrator();
    // calculate total price
    this.lineItems.forEach( line => {
      warehouseAdministrator.updatePurchasedProduct( line.productName, line.quantity );
      line.totalAmount = line.price * line.quantity;
      this.totalAmount += line.totalAmount;
      // add taxes by product
      if ( !line.taxFree ) {
        line.taxes = TaxCalculator.calculateLine( line, this.country, this.region, this.isStudent );
        this.taxesAmount += line.taxes;
        let lineTotal = line.totalAmount + line.taxes;
      }
    } );

    // add shipping costs
    if ( this.totalAmount < 100 ) {
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
    } else if ( this.totalAmount < 1000 ) {
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
    } else {
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
    this.totalAmount += this.shippingCost;
    if ( payment === this.paymentMethodExtra ) {
      this.totalAmount = this.totalAmount * 1.05;
    }

    // apply discount
    if (
      this.isVip ||
      ( this.totalAmount > 3000 && this.country === 'Portugal' ) ||
      ( this.totalAmount > 2000 && this.country === 'France' ) ||
      ( this.totalAmount > 1000 && this.country === 'Spain' )
    ) {
      this.totalAmount *= 0.9;
    }

    this.taxesAmount += TaxCalculator.calculateTotal( this.totalAmount, this.country, this.region, this.isStudent );

    const invoiceNumberFileName = path.join( __dirname, '..', 'data', this.lastinvoiceFileName );
    let lastInvoiceNumber = 0;
    if ( fs.existsSync( invoiceNumberFileName ) ) {
      lastInvoiceNumber = Number.parseInt( fs.readFileSync( invoiceNumberFileName, 'utf8' ) );
    }
    this.invoiceNumber = lastInvoiceNumber + 1;
    fs.writeFileSync( invoiceNumberFileName, this.invoiceNumber );
    this.sendOrderToWarehouse();
    this.deleteFromStorage();
  }

  private sendOrderToWarehouse() {
    // send packing list to courier
    const order = this.documentManager.getOrderMessage( this );
    // send by email
    this.documentManager.sendeEmailOrder( this, order, this.country );
  }

  public sendInvoiceToCustomer() {
    // create document
    this.documentManager.sendInvoice( this );
  }
}
