import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './printer';
import { ShoppingCart } from './shopping-cart';

export class DocumentManager {
  private readonly logFileName = `log.txt`;
  private readonly invoicePrefix = `invoice-`;
  private readonly orderPrefix = `order-`;

  private readonly emailFolder = path.join( __dirname, '..', 'data', 'email' );

  public sendInvoice( shoppingCart : ShoppingCart ) {
    const invoiceTemplate = this.getInvoiceTemplate( shoppingCart );
    this.printInvoice( shoppingCart, invoiceTemplate );
    this.emailInvoice( shoppingCart.email, invoiceTemplate );
    this.printLog( 'Sent Invoice: ' + shoppingCart.invoiceNumber );
  }

  public emailInvoice( emailAddress : string, invoiceContent : string ) {
    const invoiceMessageTemplate = this.getInvoiceMessageTemplate( invoiceContent );
    this.ensureEmailFolder();
    const invliceFileName = this.getInvoiceFileName( emailAddress );
    this.writeDocument( invliceFileName, invoiceMessageTemplate );
  }

  public getOrderTemplate( shoppingCart : ShoppingCart ) {
    const orderTemplate = `
    Invoice Number: ${shoppingCart.invoiceNumber}
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.shippingAddress}
    Items purchased:
    ${this.getDocumentItemLines( shoppingCart )}
    `;
    return orderTemplate;
  }

  public printLog( logContent : string ) {
    if ( this.hasContent( logContent ) ) {
      Printer.printContentToFile( this.logFileName, logContent );
    }
  }

  public emailOrder( shoppingCart : ShoppingCart, orderContent : string, customerCountry : string ) {
    const orderMessageTemplate = this.getOrderMessageTemplate( orderContent );
    this.ensureEmailFolder();
    const orderFileName = this.getOrderFileName( customerCountry, shoppingCart );
    this.writeDocument( orderFileName, orderMessageTemplate );
    this.printLog( 'Sent Order: ' + shoppingCart.invoiceNumber );
  }

  private getInvoiceTemplate( shoppingCart : ShoppingCart ) {
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
    return invoiceTemplate;
  }

  private getDocumentItemLines( shoppingCart : ShoppingCart ) {
    return JSON.stringify( shoppingCart.lineItems );
  }

  private printInvoice( shoppingCart : ShoppingCart, documentContent : string ) {
    const fileName = `${this.invoicePrefix}${shoppingCart.invoiceNumber}.txt`;
    if ( this.hasContent( documentContent ) ) {
      Printer.printContentToFile( fileName, documentContent );
    }
  }

  private hasContent( content : string ) {
    return content !== null && content.length > 0;
  }

  private getOrderFileName( customerCountry : string, shoppingCart : ShoppingCart ) {
    const warehouseEmailAddress = this.getWarehouseAddressByCountry( customerCountry );
    const orderFileName = `${this.orderPrefix}${shoppingCart.invoiceNumber}_${warehouseEmailAddress}.txt`;
    const fileName = path.join( this.emailFolder, orderFileName );
    return fileName;
  }

  private writeDocument( fileName : string, content : string ) {
    if ( !fs.existsSync( fileName ) ) {
      fs.writeFileSync( fileName, content );
    }
  }

  private getOrderMessageTemplate( orderContent : string ) {
    const orderMessageTemplate = `
    ---
    Serve this order ASAP.
    ---
    ${orderContent}
    Regards, the shop.acme.com
    ---`;
    return orderMessageTemplate;
  }

  private getWarehouseAddressByCountry( customerCountry : string ) {
    let warehouseAddress = 'warehouse@acme.com';
    if ( customerCountry === 'Spain' ) {
      warehouseAddress = 'warehouse@acme.es';
    }
    return warehouseAddress;
  }

  private getInvoiceFileName( emailAddress : string ) {
    const invoiceFileName = `${this.invoicePrefix}${emailAddress}.txt`;
    const fileName = path.join( this.emailFolder, invoiceFileName );
    return fileName;
  }

  private getInvoiceMessageTemplate( invoiceContent : string ) {
    const invoiceMessageTemplate = `
    ---
    See attached invoice.
    ---
    ${invoiceContent}

    Thanks for your purchasing, the shop.acme.com
    ---`;
    return invoiceMessageTemplate;
  }

  private ensureEmailFolder() {
    if ( !fs.existsSync( this.emailFolder ) ) {
      fs.mkdirSync( this.emailFolder );
    }
  }
}
