import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './Printer';

export class Warehouse {
  public static catalog: any[] = [
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
  public stock: any[] = [];

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

  public buyProduct( name: string, quantity: number ) {
    const p = Warehouse.catalog.find( p => p.name === name );
    if ( p.stock <= quantity ) {
      quantity = p.stock;
      const fileName = `log.txt`;
      Printer.print( fileName, 'out of stock: ' + p.name );
      p.stock = 0;
    } else {
      p.stock = p.stock - quantity;
    }
    this.restock( name );
  }

  public restock( name: string ) {
    const p = Warehouse.catalog.find( p => p.name === name );
    p.stock = p.minimun;
    Printer.print( 'restock-' + name + '.json', JSON.stringify( p ) );
  }
}
