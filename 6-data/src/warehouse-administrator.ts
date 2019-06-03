import * as fs from 'fs';
import * as path from 'path';
import { PRODUCT_CATALOG } from './database/product-catalog';
import { LineItem } from './models/line-item';
import { Product } from './models/product';
import { Printer } from './printer';

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

  public addProduct() { }

  public updatePurchasedProduct( purchasedItem : LineItem ) {
    const purchasedProduct = WarehouseAdministrator.findProductByName( purchasedItem.productName );
    if ( purchasedProduct !== undefined ) {
      let realPurchasedQuantity = this.getRealPurchasedQuantity( purchasedProduct, purchasedItem.quantity );
      this.updateStock( purchasedProduct, realPurchasedQuantity );
      return realPurchasedQuantity;
    } else {
      return 0;
    }
  }

  private getOrdersFolder() {
    return path.join( __dirname, '..', 'data', 'email' );
  }

  private processOrdesFolder( ordersFolder : string ) {
    if ( this.existsFolder( ordersFolder ) ) {
      fs.readdirSync( ordersFolder ).forEach( fileName => {
        this.processFileInOrderFolder( fileName, ordersFolder );
      } );
    }
  }

  private existsFolder( ordersFolder : string ) {
    return fs.existsSync( ordersFolder );
  }

  private processFileInOrderFolder( fileName : string, ordersFolder : string ) {
    if ( this.isAnOrderFile( fileName ) ) {
      this.processOrder( fileName, ordersFolder );
    }
  }

  private processOrder( orderFileName : string, ordersFolder : string ) {
    const shippmentFileName = orderFileName.replace( this.orderPrefix, this.shipmentPrefix );
    fs.renameSync( path.join( ordersFolder, orderFileName ), path.join( ordersFolder, shippmentFileName ) );
    Printer.printContentToFile( { fileName: this.logFileName, textContent: 'processed: ' + orderFileName } );
  }

  private isAnOrderFile( orderFileName : string ) {
    return path.basename( orderFileName ).startsWith( this.orderPrefix );
  }

  private getRealPurchasedQuantity( purchasedProduct : Product, quantity : number ) {
    let realPurchasedQuantity = quantity;
    if ( this.isNotEnouht( purchasedProduct, quantity ) ) {
      Printer.printContentToFile( { fileName: this.logFileName, textContent: 'not have enough: ' + purchasedProduct.name } );
      realPurchasedQuantity = purchasedProduct.stock;
    }
    return realPurchasedQuantity;
  }
  private updateStock( purchasedProduct : any, realPurchasedQuantity : number ) {
    purchasedProduct.stock = purchasedProduct.stock - realPurchasedQuantity;
    if ( this.isOutOfStock( purchasedProduct ) ) {
      this.restockProduct( purchasedProduct );
    }
    return realPurchasedQuantity;
  }

  private isNotEnouht( purchasedProduct : Product, quantity : number ) {
    return purchasedProduct.stock <= quantity;
  }
  private isOutOfStock( purchasedProduct : Product ) {
    return purchasedProduct.stock < purchasedProduct.minimumStock;
  }
  private restockProduct( productToRestoc : Product ) {
    productToRestoc.stock = productToRestoc.minimumStock;
    const fileToPrint = {
      fileName: this.restockPrefix + productToRestoc.name + '.json',
      textContent: JSON.stringify( productToRestoc )
    };
    Printer.printContentToFile( fileToPrint );
  }
}
