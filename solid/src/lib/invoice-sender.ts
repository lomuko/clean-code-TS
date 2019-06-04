import { FileManager } from '../import/file-manager';
import { PathManager } from '../import/path-manager';
import { IDocumentSender } from '../models/i-document-sender';
import { ShoppingCart } from '../models/shopping-cart';
import { Logger } from '../tools/logger';
import { Printer } from '../tools/printer';
import { TemplateManager } from './template-manager';

export class InvoiceSender implements IDocumentSender {
  private readonly invoicePrefix = `invoice-`;
  private readonly templateManager = new TemplateManager();
  private readonly fileManager = new FileManager();
  private readonly pathManager = new PathManager();
  private readonly logger = new Logger();
  private readonly emailFolder = this.pathManager.emailFolder;

  public send( shoppingCart : ShoppingCart ) {
    const invoiceTemplate = this.templateManager.getInvoiceTemplate( shoppingCart );
    this.printInvoice( shoppingCart, invoiceTemplate );
    this.sendEmailInvoice( shoppingCart.client.email, invoiceTemplate );
    this.logger.print( 'Sent Invoice: ' + shoppingCart.legalAmounts.invoiceNumber );
  }

  private printInvoice( shoppingCart : ShoppingCart, documentContent : string ) {
    const fileName = `${this.invoicePrefix}${shoppingCart.legalAmounts.invoiceNumber}.txt`;
    Printer.printContentToFile( { fileName, textContent: documentContent } );
  }

  private sendEmailInvoice( emailAddress : string, invoiceContent : string ) {
    const invoiceMessageTemplate = this.templateManager.getInvoiceMessageTemplate( invoiceContent );
    this.fileManager.ensureFolder( this.emailFolder );
    const invoiceFileName = this.getInvoiceFileName( emailAddress );
    this.fileManager.writeFile( { path: invoiceFileName, content: invoiceMessageTemplate } );
  }
  private getInvoiceFileName( emailAddress : string ) {
    const invoiceFileName = `${this.invoicePrefix}${emailAddress}.txt`;
    const fileName = this.pathManager.join( this.emailFolder, invoiceFileName );
    return fileName;
  }
}
