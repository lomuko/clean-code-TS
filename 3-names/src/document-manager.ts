import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './Printer';
import { ShoppingCart } from './shopping-cart';

export class DocumentManager {
  public sendInvoice( shoppingCart : ShoppingCart ) {
    const invoice = `
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
    Tax: #${shoppingCart.taxes}Euros
    Total Amount: #${shoppingCart.totalAmount + shoppingCart.taxes}Euros
    `;
    this.printDocument( shoppingCart, invoice );
    this.emailInvoice( shoppingCart.email, invoice );
    this.printLog( 'Sent Invoice: ' + shoppingCart.invoiceNumber );
  }

  private getDocumentItemLines( shoppingCart : ShoppingCart ) {
    return JSON.stringify( shoppingCart.lineItems );
  }

  public getOrderMessage( shoppingCart : ShoppingCart ) {
    return `
    Invoice Number: ${shoppingCart.invoiceNumber}
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.shippingAddress}
    Items purchased:
    ${this.getDocumentItemLines( shoppingCart )}
    `;
  }

  public printDocument( shoppingCart : ShoppingCart, documentContent : string ) {
    const fileName = `invoice-${shoppingCart.invoiceNumber}.txt`;
    if ( documentContent ) {
      Printer.print( fileName, documentContent );
    }
  }

  public printLog( logContent : string ) {
    const fileName = `log.txt`;
    if ( logContent ) {
      Printer.print( fileName, logContent );
    }
  }

  public emailOrder( shoppingCart : ShoppingCart, orderContent : string, customerCountry : string ) {
    const warehouse = this.getWarehouseAddressByCountry( customerCountry );
    const message = `
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
      fs.writeFileSync( path.join( __dirname, '..', 'data', 'email', fileName ), message );
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
    const message = `
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
      fs.writeFileSync( path.join( __dirname, '..', 'data', 'email', fileName ), message );
    }
  }
}
