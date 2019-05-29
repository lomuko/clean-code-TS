import { COUNTRY_CONFIGURATIONS } from './config/country-configurations';
import { FileManager } from './file-manager';
import { Logger } from './logger';
import { CountryConfiguration } from './models/country-configuration';
import { PathManager } from './path-manager';
import { Printer } from './printer';
import { ShoppingCart } from './shopping-cart';
import { TemplateManager } from './template-manager';

export class DocumentManager {
  private readonly countryConfigurations : CountryConfiguration[] = COUNTRY_CONFIGURATIONS;

  private readonly invoicePrefix = `invoice-`;
  private readonly orderPrefix = `order-`;
  private readonly templateManager = new TemplateManager();
  private readonly fileManager = new FileManager();
  private readonly pathManager = new PathManager();
  private readonly logger = new Logger();
  private readonly emailFolder = this.pathManager.emailFolder;

  public emailOrder( shoppingCart : ShoppingCart, customerCountry : string ) {
    const orderContent = this.templateManager.getOrderTemplate( shoppingCart );
    const orderMessageTemplate = this.templateManager.getOrderMessageTemplate( orderContent );
    this.fileManager.ensureFolder( this.emailFolder );
    const orderFileName = this.getOrderFileName( customerCountry, shoppingCart );
    this.fileManager.writeFile( { path: orderFileName, content: orderMessageTemplate } );
    this.logger.print( 'Sent Order: ' + shoppingCart.legalAmounts.invoiceNumber );
  }

  public sendInvoice( shoppingCart : ShoppingCart ) {
    const invoiceTemplate = this.templateManager.getInvoiceTemplate( shoppingCart );
    this.printInvoice( shoppingCart, invoiceTemplate );
    this.emailInvoice( shoppingCart.client.email, invoiceTemplate );
    this.logger.print( 'Sent Invoice: ' + shoppingCart.legalAmounts.invoiceNumber );
  }

  public emailInvoice( emailAddress : string, invoiceContent : string ) {
    const invoiceMessageTemplate = this.templateManager.getInvoiceMessageTemplate( invoiceContent );
    this.fileManager.ensureFolder( this.emailFolder );
    const invoiceFileName = this.getInvoiceFileName( emailAddress );
    this.fileManager.writeFile( { path: invoiceFileName, content: invoiceMessageTemplate } );
  }

  private printInvoice( shoppingCart : ShoppingCart, documentContent : string ) {
    const fileName = `${this.invoicePrefix}${shoppingCart.legalAmounts.invoiceNumber}.txt`;
    Printer.printContentToFile( { fileName, textContent: documentContent } );
  }

  private getOrderFileName( customerCountry : string, shoppingCart : ShoppingCart ) {
    const warehouseEmailAddress = this.getWarehouseAddressByCountry( customerCountry );
    const orderFileName = `${this.orderPrefix}${shoppingCart.legalAmounts.invoiceNumber}_${warehouseEmailAddress}.txt`;
    const fileName = this.pathManager.join( this.emailFolder, orderFileName );
    return fileName;
  }

  private getWarehouseAddressByCountry( customerCountry : string ) {
    let countryConfig = this.countryConfigurations.find( country => country.countryName === customerCountry );
    if ( countryConfig === undefined ) {
      countryConfig = this.countryConfigurations[0];
    }
    return countryConfig.warehouseAddress;
  }

  private getInvoiceFileName( emailAddress : string ) {
    const invoiceFileName = `${this.invoicePrefix}${emailAddress}.txt`;
    const fileName = this.pathManager.join( this.emailFolder, invoiceFileName );
    return fileName;
  }
}
