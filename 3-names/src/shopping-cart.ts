import * as fs from 'fs';
import * as path from 'path';
import { DocumentManager } from './document-manager';
import { TaxCalculator } from './tax-calculator';
import { WarehouseAdministrator } from './warehouse-administrator';

export class ShoppingCart {
  public lineItems : any[] = [];
  public totalAmount : number = 0;
  public shippingCost = 0;
  public taxes : number = 0;
  public payment : string = '';
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

  public addProduct(
    productName : string,
    price : number,
    quantity : number,
    country? : string,
    taxFree? : boolean
  ) {
    this.lineItems.push( { productName, price, quantity } );
  }

  public removeProductLine( productName : string ) {
    this.lineItems = this.lineItems.filter( lineItem => lineItem.productName !== productName );
  }

  public saveToStorage() {
    if ( !fs.existsSync( path.join( __dirname, '..', 'data' ) ) ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data' ) );
    }
    const fileName = `shopping-${this.clientName}.json`;
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', fileName ) ) ) {
      fs.writeFileSync(
        path.join( __dirname, '..', 'data', fileName ),
        JSON.stringify( this.lineItems )
      );
    }
  }

  public loadFromStorage() {
    const fileName = path.join( __dirname, '..', 'data', `shopping-${this.clientName}.json` );
    if ( fs.existsSync( fileName ) ) {
      const file = fs.readFileSync( fileName, 'utf8' );
      this.lineItems = JSON.parse( file );
    }
  }

  public deleteFromStorage() {
    const fileName = path.join( __dirname, '..', 'data', `shopping-${this.clientName}.json` );
    if ( fs.existsSync( fileName ) ) {
      fs.unlinkSync( fileName );
    }
  }

  public calculate(
    payment : string,
    paymentId : string,
    shippingAddress : string,
    billingAddress? : string
  ) {
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress || shippingAddress;
    this.payment = payment;
    this.paymentId = paymentId;
    const warehouseAdministrator = new WarehouseAdministrator();
    // calculate total price
    this.lineItems.forEach( line => {
      warehouseAdministrator.updateBuyedProduct( line.product, line.quantity );
      line.totalAmount = line.price * line.quantity;
      this.totalAmount += line.totalAmount;
      // add taxes by product
      if ( !line.taxFree ) {
        line.taxes = TaxCalculator.calculateLine(
          line,
          this.country,
          this.region,
          this.isStudent
        );
        this.taxes += line.taxes;
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
    if ( payment === 'PayPal' ) {
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

    this.taxes += TaxCalculator.calculate(
      this.totalAmount,
      this.country,
      this.region,
      this.isStudent
    );

    const lastInvoice = path.join( __dirname, '..', 'data', `lastinvoice.txt` );
    let invoiceNumber = 0;
    if ( fs.existsSync( lastInvoice ) ) {
      invoiceNumber = Number.parseInt( fs.readFileSync( lastInvoice, 'utf8' ) );
    }
    invoiceNumber++;
    this.invoiceNumber = invoiceNumber;
    fs.writeFileSync( lastInvoice, invoiceNumber );
    this.saveToWarehouse();
    this.deleteFromStorage();
  }

  // save to process at the warehouse
  private saveToWarehouse() {
    // send packing list to courier
    const order = this.documentManager.getOrderMessage( this );
    // send by email
    this.documentManager.emailOrder( this, order, this.country );
  }

  // send invoice to customer
  public sendInvoiceToCustomer() {
    // create document
    this.documentManager.sendInvoice( this );
  }
}
