import * as fs from 'fs';
import * as path from 'path';
import { COUNTRY_CONFIGURATIONS } from './database/config/country-configurations';
import { CountryConfiguration } from './models/country-configuration';
import { Printer } from './printer';
import { ShoppingCart } from './shopping-cart';

export class DocumentManager {
  private readonly countryConfigurations : CountryConfiguration[] = COUNTRY_CONFIGURATIONS;
  private readonly logFileName = `log.txt`;
  private readonly emailFolder = path.join( __dirname, '..', 'data', 'email' );
  private readonly invoicePrefix = `invoice-`;
  private readonly orderPrefix = `order-`;

  public sendInvoice( shoppingCart : ShoppingCart ) {
    const invoiceTemplate = this.getInvoiceTemplate( shoppingCart );
    this.printInvoice( shoppingCart, invoiceTemplate );
    this.sendEmailInvoice( shoppingCart.client.email, invoiceTemplate );
    this.printLog( 'Sent Invoice: ' + shoppingCart.legalAmounts.invoiceNumber );
  }

  private getInvoiceTemplate( shoppingCart : ShoppingCart ) {
    const invoiceTemplate = `
    LEGAL INVOICE FROM acme!
    ========================
    Invoice Number: ${shoppingCart.legalAmounts.invoiceNumber}#
    ----------------------------------------------
    ${shoppingCart.client.name} - ${shoppingCart.client.taxNumber}
    ${shoppingCart.checkOut.billingAddress}
    ${shoppingCart.client.country} - ${shoppingCart.client.region}
    Items purchased:
    ${this.getDocumentItemLines( shoppingCart )}
    Amount: #${shoppingCart.legalAmounts.total - shoppingCart.legalAmounts.shippingCost}Euros
    Shipping Cost: #${shoppingCart.legalAmounts.shippingCost}Euros
    Base Amount: #${shoppingCart.legalAmounts.total}Euros
    Tax: #${shoppingCart.legalAmounts.taxes}Euros
    Total Amount: #${shoppingCart.legalAmounts.total + shoppingCart.legalAmounts.taxes}Euros
    `;
    return invoiceTemplate;
  }

  private getDocumentItemLines( shoppingCart : ShoppingCart ) {
    return JSON.stringify( shoppingCart.lineItems );
  }

  public getOrderTemplate( shoppingCart : ShoppingCart ) {
    const orderTemplate = `
    Invoice Number: ${shoppingCart.legalAmounts.invoiceNumber}
    ${shoppingCart.client.name} - ${shoppingCart.client.taxNumber}
    ${shoppingCart.checkOut.shippingAddress}
    Items purchased:
    ${this.getDocumentItemLines( shoppingCart )}
    `;
    return orderTemplate;
  }

  private printInvoice( shoppingCart : ShoppingCart, documentContent : string ) {
    const fileName = `${this.invoicePrefix}${shoppingCart.legalAmounts.invoiceNumber}.txt`;
    if ( this.hasContent( documentContent ) ) {
      Printer.printContentToFile( { fileName, textContent: documentContent } );
    }
  }

  public printLog( logContent : string ) {
    if ( this.hasContent( logContent ) ) {
      Printer.printContentToFile( { fileName: this.logFileName, textContent: logContent } );
    }
  }

  private hasContent( content : string ) {
    return content !== null && content.length > 0;
  }

  public sendemailOrder( shoppingCart : ShoppingCart, orderContent : string, customerCountry : string ) {
    const orderMessageTemplate = this.getOrderMessageTemplate( orderContent );
    this.ensureEmailFolder();
    const orderFileName = this.getOrderFileName( customerCountry, shoppingCart );
    this.writeDocument( orderFileName, orderMessageTemplate );
    this.printLog( 'Sent Order: ' + shoppingCart.legalAmounts.invoiceNumber );
  }

  private getOrderFileName( customerCountry : string, shoppingCart : ShoppingCart ) {
    const warehouseEmailAddress = this.getWarehouseAddressByCountry( customerCountry );
    const orderFileName = `${this.orderPrefix}${shoppingCart.legalAmounts.invoiceNumber}_${warehouseEmailAddress}.txt`;
    const fileName = path.join( this.emailFolder, orderFileName );
    return fileName;
  }

  private writeDocument( fileName : string, content : string ) {
    if ( this.notExistFile( fileName ) ) {
      fs.writeFileSync( fileName, content );
    }
  }

  private notExistFile( fileName : string ) {
    return !fs.existsSync( fileName );
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
    let countryConfig = this.countryConfigurations.find( country => country.countryName === customerCountry );
    if ( countryConfig === undefined ) {
      countryConfig = this.countryConfigurations[0];
    }
    return countryConfig.warehouseAddress;
  }

  public sendEmailInvoice( emailAddress : string, invoiceContent : string ) {
    const invoiceMessageTemplate = this.getInvoiceMessageTemplate( invoiceContent );
    this.ensureEmailFolder();
    const invliceFileName = this.getInvoiceFileName( emailAddress );
    this.writeDocument( invliceFileName, invoiceMessageTemplate );
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
    if ( this.notExistsFolder() ) {
      fs.mkdirSync( this.emailFolder );
    }
  }

  private notExistsFolder() {
    return !fs.existsSync( this.emailFolder );
  }
}
