import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './printer';
import { Product } from './product';
import { PRODUCT_CATALOG } from './product-catalog';

export class WarehouseAdministrator {
  public static productCatalog : Product[] = PRODUCT_CATALOG;
  private readonly logFileName = `log.txt`;
  private readonly shipmentPrefix = `shipment-`;
  private readonly orderPrefix = `order-`;
  private readonly restockPrefix = `restock-`;
  public stock : any[] = [];

  private static findProductByName( productName : string ) {
    return WarehouseAdministrator.productCatalog.find( product => product.name === productName );
  }

  public processOrders() {
    const ordersFolder = this.getOrdersFolder();
    this.processOrdesFolder( ordersFolder );
  }
  private getOrdersFolder() {
    return path.join( __dirname, '..', 'data', 'email' );
  }

  private processOrdesFolder( ordersFolder : string ) {
    if ( fs.existsSync( ordersFolder ) ) {
      fs.readdirSync( ordersFolder ).forEach( fileName => {
        this.processFileInOrderFolder( fileName, ordersFolder );
      } );
    }
  }

  private processFileInOrderFolder( fileName : string, ordersFolder : string ) {
    if ( this.isAnOrderFile( fileName ) ) {
      this.processOrder( fileName, ordersFolder );
    }
  }

  private processOrder( orderFileName : string, ordersFolder : string ) {
    const shippmentFileName = orderFileName.replace( this.orderPrefix, this.shipmentPrefix );
    fs.renameSync( path.join( ordersFolder, orderFileName ), path.join( ordersFolder, shippmentFileName ) );
    Printer.printContentToFile( this.logFileName, 'processed: ' + orderFileName );
  }

  private isAnOrderFile( orderFileName : string ) {
    return path.basename( orderFileName ).startsWith( this.orderPrefix );
  }

  public addProduct() { }

  public updateBuyedProduct( buyedProductName : string, buyedQuantity : number ) {
    const buyedProduct = WarehouseAdministrator.findProductByName( buyedProductName );
    if ( buyedProduct !== undefined ) {
      let realBuyedQuantity = this.getRealBuyedQuantity( buyedProduct, buyedQuantity );
      this.updateStock( buyedProduct, realBuyedQuantity );
      return realBuyedQuantity;
    } else {
      return 0;
    }
  }

  private getRealBuyedQuantity( buyedProduct : Product, buyedQuantity : number ) {
    let realBuyedQuantity = buyedQuantity;
    if ( this.isNotEnouht( buyedProduct, buyedQuantity ) ) {
      Printer.printContentToFile( this.logFileName, 'not have enough: ' + buyedProduct.name );
      realBuyedQuantity = buyedProduct.stock;
    }
    return realBuyedQuantity;
  }
  private updateStock( buyedProduct : any, realBuyedQuantity : number ) {
    buyedProduct.stock = buyedProduct.stock - realBuyedQuantity;
    if ( this.isOutOfStock( buyedProduct ) ) {
      this.restockProduct( buyedProduct );
    }
    return realBuyedQuantity;
  }

  private isNotEnouht( buyedProduct : Product, buyedQuantity : number ) {
    return buyedProduct.stock <= buyedQuantity;
  }
  private isOutOfStock( buyedProduct : Product ) {
    return buyedProduct.stock < buyedProduct.minimumStock;
  }
  private restockProduct( productToRestoc : Product ) {
    productToRestoc.stock = productToRestoc.minimumStock;
    Printer.printContentToFile( this.restockPrefix + productToRestoc.name + '.json', JSON.stringify( productToRestoc ) );
  }
}
