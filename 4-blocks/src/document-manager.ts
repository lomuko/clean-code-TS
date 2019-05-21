import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './Printer';
import { ShoppingCart } from './shopping-cart';

export class DocumentManager {
  private readonly logFileName = `log.txt`;

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
    this.emailInvoice( shoppingCart.email, invoiceTemplate );
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
    const fileName = `invoice-${shoppingCart.invoiceNumber}.txt`;
    if ( documentContent ) {
      Printer.print( fileName, documentContent );
    }
  }

  public printLog( logContent : string ) {
    if ( logContent ) {
      Printer.print( this.logFileName, logContent );
    }
  }

  public emailOrder( shoppingCart : ShoppingCart, orderContent : string, customerCountry : string ) {
    const warehouse = this.getWarehouseAddressByCountry( customerCountry );
    const orderMessageTemplate = `
    ---
    Serve this order ASAP.
    ---
    ${orderContent}
    Regards, the shop.acme.com
    ---`;
    const fileName = `order-${shoppingCart.invoiceNumber}_${warehouse}.txt`;
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', 'email' ) ) ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data', 'email' ) );
    }
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', 'email', fileName ) ) ) {
      fs.writeFileSync(
        path.join( __dirname, '..', 'data', 'email', fileName ),
        orderMessageTemplate
      );
    }
    this.printLog( 'Sent Order: ' + shoppingCart.invoiceNumber );
  }

  private getWarehouseAddressByCountry( customerCountry : string ) {
    if ( customerCountry === 'Spain' ) {
      return 'warehouse@acme.es';
    }
    return 'warehouse@acme.com';
  }

  public emailInvoice( emailAddress : string, invoiceContent : string ) {
    const invoiceMessageTemplate = `
    ---
    See attached invoice.
    ---
    ${invoiceContent}

    Thanks for your purchasing, the shop.acme.com
    ---`;
    const fileName = `invoice-${emailAddress}.txt`;
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', 'email' ) ) ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data', 'email' ) );
    }
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', 'email', fileName ) ) ) {
      fs.writeFileSync(
        path.join( __dirname, '..', 'data', 'email', fileName ),
        invoiceMessageTemplate
      );
    }
  }
}
