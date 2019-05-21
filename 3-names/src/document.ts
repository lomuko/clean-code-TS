import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './Printer';
import { ShoppingCart } from './shopping-cart';

export class Document {
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
    ${this.lines( shoppingCart )}
    Amount: #${shoppingCart.totalAmount - shoppingCart.shipping_cost}Euros
    Shipping Cost: #${shoppingCart.shipping_cost}Euros
    Base Amount: #${shoppingCart.totalAmount}Euros
    Tax: #${shoppingCart.taxes}Euros
    Total Amount: #${shoppingCart.totalAmount + shoppingCart.taxes}Euros
    `;
    this.print( shoppingCart, invoice );
    this.emailInvoice( shoppingCart.email, invoice );
    this.printLog( 'Sent Invoice: ' + shoppingCart.invoiceNumber );
  }

  private lines( shoppingCart : ShoppingCart ) {
    return JSON.stringify( shoppingCart.items );
  }

  public order( shoppingCart : ShoppingCart ) {
    return `
    Invoice Number: ${shoppingCart.invoiceNumber}
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.shippingAddress}
    Items purchased:
    ${this.lines( shoppingCart )}
    `;
  }

  public print( shoppingCart : ShoppingCart, doc : string ) {
    const fileName = `invoice-${shoppingCart.invoiceNumber}.txt`;
    if ( doc ) {
      Printer.print( fileName, doc );
    }
  }

  public printLog( doc : string ) {
    const fileName = `log.txt`;
    if ( doc ) {
      Printer.print( fileName, doc );
    }
  }

  public emailOrder( shoppingCart : ShoppingCart, doc : string, country : string ) {
    const warehouse = this.getAddress( country );
    const message = `
    ---
    Serve this order ASAP.
    ---
    ${doc}
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

  private getAddress( country : string ) {
    if ( country === 'Spain' ) {
      return 'warehouse@acme.es';
    }
    return 'warehouse@acme.com';
  }

  public emailInvoice( address : string, invoice : string ) {
    const message = `
    ---
    See attached invoice.
    ---
    ${invoice}

    Thanks for your purchasing, the shop.acme.com
    ---`;
    const fileName = `invoice-${address}.txt`;
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', 'email' ) ) ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data', 'email' ) );
    }
    if ( !fs.existsSync( path.join( __dirname, '..', 'data', 'email', fileName ) ) ) {
      fs.writeFileSync( path.join( __dirname, '..', 'data', 'email', fileName ), message );
    }
  }
}
