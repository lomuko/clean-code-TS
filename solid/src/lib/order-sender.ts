import { COUNTRY_CONFIGURATIONS } from '../database/config/country-configurations';
import { Checker } from '../helper/checker';
import { Logger } from '../helper/logger';
import { FileManager } from '../import/file-manager';
import { PathManager } from '../import/path-manager';
import { CountryConfiguration } from '../models/country-configuration';
import { IDocumentSender } from '../models/i-document-sender';
import { ShoppingCart } from '../models/shopping-cart';
import { TemplateManager } from './template-manager';

export class OrderSender implements IDocumentSender {
  private readonly countryConfigurations : CountryConfiguration[] = COUNTRY_CONFIGURATIONS;
  private readonly orderPrefix = `order-`;
  private readonly templateManager = new TemplateManager();
  private readonly fileManager = new FileManager();
  private readonly pathManager = new PathManager();
  private readonly logger = new Logger();
  private readonly checker = new Checker();
  private readonly emailFolder = this.pathManager.emailFolder;

  public send( shoppingCart : ShoppingCart ) {
    const orderContent = this.templateManager.getOrderTemplate( shoppingCart );
    const orderMessageTemplate = this.templateManager.getOrderMessageTemplate( orderContent );
    this.fileManager.ensureFolder( this.emailFolder );
    const orderFileName = this.getOrderFileName( shoppingCart );
    this.fileManager.writeFile( { path: orderFileName, content: orderMessageTemplate } );
    this.logger.print( 'Sent Order: ' + shoppingCart.legalAmounts.invoiceNumber );
  }

  private getOrderFileName( shoppingCart : ShoppingCart ) {
    const customerCountry : string = shoppingCart.client.country;
    const warehouseEmailAddress = this.getWarehouseAddressByCountry( customerCountry );
    const orderFileName = `${this.orderPrefix}${shoppingCart.legalAmounts.invoiceNumber}_${warehouseEmailAddress}.txt`;
    const fileName = this.pathManager.join( this.emailFolder, orderFileName );
    return fileName;
  }

  private getWarehouseAddressByCountry( customerCountry : string ) {
    const countryConfiguration = this.checker.findSafe(
      this.countryConfigurations,
      country => country.countryName === customerCountry
    );
    return countryConfiguration.warehouseAddress;
  }
}
