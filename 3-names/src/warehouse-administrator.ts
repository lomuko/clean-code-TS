import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './Printer';

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
  public stock : any[] = [];

  public processOrders() {
    const ordersFolder = path.join( __dirname, '..', 'data', 'email' );
    if ( fs.existsSync( ordersFolder ) ) {
      fs.readdirSync( ordersFolder ).forEach( file => {
        if ( path.basename( file ).startsWith( 'order-' ) ) {
          const shippment = file.replace( 'order-', 'shipment-' );
          fs.renameSync(
            path.join( __dirname, '..', 'data', 'email', file ),
            path.join( __dirname, '..', 'data', 'email', shippment )
          );
          const fileName = `log.txt`;
          Printer.print( fileName, 'processed: ' + file );
        }
      } );
    }
  }

  public addProduct() { }

  public updateBuyedProduct( buyedProductName : string, buyedQuantity : number ) {
    const buyedProduct = WarehouseAdministrator.productCatalog.find(
      product => product.name === buyedProductName
    );
    if ( buyedProduct.stock <= buyedQuantity ) {
      buyedQuantity = buyedProduct.stock;
      const fileName = `log.txt`;
      Printer.print( fileName, 'out of stock: ' + buyedProduct.name );
      buyedProduct.stock = 0;
    } else {
      buyedProduct.stock = buyedProduct.stock - buyedQuantity;
    }
    this.restockProduct( buyedProductName );
  }

  public restockProduct( productName : string ) {
    const productToRestoc = WarehouseAdministrator.productCatalog.find(
      product => product.name === productName
    );
    productToRestoc.stock = productToRestoc.minimun;
    Printer.print( 'restock-' + productName + '.json', JSON.stringify( productToRestoc ) );
  }
}
