import { FileManager } from './import/file-manager';
import { PathManager } from './import/path-manager';
import { Logger } from './tools/logger';

export class OrdersProcessor {
  private readonly pathManager = new PathManager();
  private readonly fileManager = new FileManager();
  private readonly logger = new Logger();
  private readonly shipmentPrefix = `shipment-`;
  private readonly orderPrefix = `order-`;

  public processOrders() {
    const ordersFolder = this.getOrdersFolder();
    this.processOrdesFolder( ordersFolder );
  }

  private getOrdersFolder() {
    return this.pathManager.emailFolder;
  }
  private processOrdesFolder( ordersFolder : string ) {
    this.fileManager.readFolderFileList( ordersFolder ).forEach( fileName => {
      this.processFileInOrderFolder( fileName, ordersFolder );
    } );
  }

  private processFileInOrderFolder( fileName : string, ordersFolder : string ) {
    if ( this.isAnOrderFile( fileName ) ) {
      this.processOrder( fileName, ordersFolder );
    }
  }

  private processOrder( orderFileName : string, ordersFolder : string ) {
    const shippmentFileName = orderFileName.replace( this.orderPrefix, this.shipmentPrefix );
    this.fileManager.renameFile(
      this.pathManager.join( ordersFolder, orderFileName ),
      this.pathManager.join( ordersFolder, shippmentFileName )
    );
    this.logger.print( 'processed: ' + orderFileName );
  }

  private isAnOrderFile( orderFileName : string ) {
    return this.pathManager.baseName( orderFileName ).startsWith( this.orderPrefix );
  }
}
