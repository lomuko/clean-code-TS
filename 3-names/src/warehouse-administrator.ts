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
  private readonly logFileName = `log.txt`;
  private readonly shipmentPrefix = `shipment-`;
  private readonly orderPrefix = `order-`;
  private readonly restockPrefix = `restock-`;
  public stock : any[] = [];

  public processOrders() {
    const ordersFolder = path.join( __dirname, '..', 'data', 'email' );
    if ( fs.existsSync( ordersFolder ) ) {
      fs.readdirSync( ordersFolder ).forEach( orderFileName => {
        if ( path.basename( orderFileName ).startsWith( this.orderPrefix ) ) {
          const shippmentFileName = orderFileName.replace( this.orderPrefix, this.shipmentPrefix );
          fs.renameSync(
            path.join( __dirname, '..', 'data', 'email', orderFileName ),
            path.join( __dirname, '..', 'data', 'email', shippmentFileName )
          );
          Printer.printContentToFile( this.logFileName, 'processed: ' + orderFileName );
        }
      } );
    }
  }

  public addProduct() { }

  public updateBuyedProduct( buyedProductName : string, buyedQuantity : number ) {
    const buyedProduct = WarehouseAdministrator.productCatalog.find( product => product.name === buyedProductName );
    if ( buyedProduct.stock <= buyedQuantity ) {
      buyedQuantity = buyedProduct.stock;
      Printer.printContentToFile( this.logFileName, 'out of stock: ' + buyedProduct.name );
      buyedProduct.stock = 0;
    } else {
      buyedProduct.stock = buyedProduct.stock - buyedQuantity;
    }
    this.restockProduct( buyedProductName );
  }

  public restockProduct( productName : string ) {
    const productToRestoc = WarehouseAdministrator.productCatalog.find( product => product.name === productName );
    productToRestoc.stock = productToRestoc.minimun;
    Printer.printContentToFile( this.restockPrefix + productName + '.json', JSON.stringify( productToRestoc ) );
  }
}
