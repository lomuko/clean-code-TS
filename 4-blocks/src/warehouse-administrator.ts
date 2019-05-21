import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './printer';
import { Product } from './product';

export class WarehouseAdministrator {
  public static productCatalog : any[] = [
    {
      name: 'monitor',
      price: 1000,
      stock: 50,
      minimun: 20
    },
    {
      name: 'computer',
      price: 200,
      stock: 20,
      minimun: 3
    },
    {
      name: 'printer',
      price: 1000,
      stock: 10,
      minimun: 5
    },
    {
      name: 'course',
      price: 100,
      stock: 1000000,
      minimun: 1000000,
      taxFree: true
    }
  ];
  private readonly logFileName = `log.txt`;
  public stock : any[] = [];

  private static findProductByName( productName : string ) {
    return WarehouseAdministrator.productCatalog.find( product => product.name === productName );
  }

  public processOrders() {
    const ordersFolder = path.join( __dirname, '..', 'data', 'email' );
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
    const shippmentFileName = orderFileName.replace( 'order-', 'shipment-' );
    fs.renameSync(
      path.join( ordersFolder, orderFileName ),
      path.join( ordersFolder, shippmentFileName )
    );
    Printer.print( this.logFileName, 'processed: ' + orderFileName );
  }

  private isAnOrderFile( orderFileName : string ) {
    return path.basename( orderFileName ).startsWith( 'order-' );
  }

  public addProduct() { }

  public updateBuyedProduct( buyedProductName : string, buyedQuantity : number ) {
    const buyedProduct = WarehouseAdministrator.findProductByName( buyedProductName );
    if ( this.isOutOfStock( buyedProduct, buyedQuantity ) ) {
      buyedQuantity = buyedProduct.stock;
      Printer.print( this.logFileName, 'out of stock: ' + buyedProduct.name );
    }
    buyedProduct.stock = buyedProduct.stock - buyedQuantity;
    this.restockProduct( buyedProductName );
  }

  private isOutOfStock( buyedProduct : Product, buyedQuantity : number ) {
    return buyedProduct.stock <= buyedQuantity;
  }

  public restockProduct( productName : string ) {
    const productToRestoc = WarehouseAdministrator.findProductByName( productName );
    productToRestoc.stock = productToRestoc.minimun;
    Printer.print( 'restock-' + productName + '.json', JSON.stringify( productToRestoc ) );
  }
}
