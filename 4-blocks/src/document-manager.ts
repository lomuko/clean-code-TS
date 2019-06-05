import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './printer';
import { ShoppingCart } from './shopping-cart';

export class DocumentManager {
  private readonly logFileName = `log.txt`;
  private readonly invoicePrefix = `invoice-`;
  private readonly orderPrefix = `order-`;

  public sendInvoice( shoppingCart : ShoppingCart ) {
    const invoiceTemplate = `
    LEGAL INVOICE FROM acme!
    ========================
    Invoice Number: ${shoppingCart.invoiceNumber}#
    ----------------------------------------------
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.billingAddress}
    ${shoppingCart.country} - ${shoppingCart.region}
    Items purchased:
    ${this.getDocumentItemLines( shoppingCart )}
    Amount: #${shoppingCart.totalAmount - shoppingCart.shippingCost}Euros
    Shipping Cost: #${shoppingCart.shippingCost}Euros
    Base Amount: #${shoppingCart.totalAmount}Euros
    Tax: #${shoppingCart.taxesAmount}Euros
    Total Amount: #${shoppingCart.totalAmount + shoppingCart.taxesAmount}Euros
    `;
    this.printDocument( shoppingCart, invoiceTemplate );
    this.sendEmailInvoice( shoppingCart.email, invoiceTemplate );
    this.printLog( 'Sent Invoice: ' + shoppingCart.invoiceNumber );
  }

  private getDocumentItemLines( shoppingCart : ShoppingCart ) {
    return JSON.stringify( shoppingCart.lineItems );
  }

  public getOrderMessage( shoppingCart : ShoppingCart ) {
    const orderTemplate = `
    Invoice Number: ${shoppingCart.invoiceNumber}
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.shippingAddress}
    Items purchased:
    ${this.getDocumentItemLines( shoppingCart )}
    `;
    return orderTemplate;
  }

  public printDocument( shoppingCart : ShoppingCart, documentContent : string ) {
    const fileName = `${this.invoicePrefix}${shoppingCart.invoiceNumber}.txt`;
    if ( this.hasContent( documentContent ) ) {
      Printer.printContentToFile( fileName, documentContent );
    }
  }

  public printLog( logContent : string ) {
    if ( this.hasContent( logContent ) ) {
      Printer.printContentToFile( this.logFileName, logContent );
    }
  }

  private hasContent( content : string ) {
    return content !== null && content.length > 0;
  }

  public sendEmailOrder( shoppingCart : ShoppingCart, orderContent : string, customerCountry : string ) {
    const warehouse = this.getWarehouseAddressByCountry( customerCountry );
    const orderMessageTemplate = `
    ---
    Serve this order ASAP.
    ---
    ${orderContent}
    Regards, the shop.acme.com
    ---`;
    const fileName = `${this.orderPrefix}${shoppingCart.invoiceNumber}_${warehouse}.txt`;
    if ( this.notExistsEmailFolder() ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data', 'email' ) );
    }
    if ( this.notExistsFileInEmailFolder( fileName ) ) {
      fs.writeFileSync( path.join( __dirname, '..', 'data', 'email', fileName ), orderMessageTemplate );
    }
    this.printLog( 'Sent Order: ' + shoppingCart.invoiceNumber );
  }

  private getWarehouseAddressByCountry( customerCountry : string ) {
    if ( customerCountry === 'Spain' ) {
      return 'warehouse@acme.es';
    }
    return 'warehouse@acme.com';
  }

  public sendEmailInvoice( emailAddress : string, invoiceContent : string ) {
    const invoiceMessageTemplate = `
    ---
    See attached invoice.
    ---
    ${invoiceContent}

    Thanks for your purchasing, the shop.acme.com
    ---`;
    const fileName = `${this.invoicePrefix}${emailAddress}.txt`;
    if ( this.notExistsEmailFolder() ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data', 'email' ) );
    }
    if ( this.notExistsFileInEmailFolder( fileName ) ) {
      fs.writeFileSync( path.join( __dirname, '..', 'data', 'email', fileName ), invoiceMessageTemplate );
    }
  }

  private notExistsEmailFolder() {
    return !fs.existsSync( path.join( __dirname, '..', 'data', 'email' ) );
  }
  private notExistsFileInEmailFolder( fileName : string ) {
    return !fs.existsSync( path.join( __dirname, '..', 'data', 'email', fileName ) );
  }
}
