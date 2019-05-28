import * as fs from 'fs';
import * as path from 'path';
import { Printer } from './printer';

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
      this.processOrdersFolder( ordersFolder );
    }
  }

  private processOrdersFolder( ordersFolder : string ) {
    fs.readdirSync( ordersFolder ).forEach( fileName => {
      this.processFileInOrderFolder( fileName, ordersFolder );
    } );
  }

  private processFileInOrderFolder( fileName : string, ordersFolder : string ) {
    if ( this.isAnOrderFile( fileName ) ) {
      this.processOrder( fileName, ordersFolder );
    }
  }

  private isAnOrderFile( fileName : string ) {
    return path.basename( fileName ).startsWith( this.orderPrefix );
  }

  private processOrder( orderFileName : string, ordersFolder : string ) {
    const shippmentFileName = orderFileName.replace( this.orderPrefix, this.shipmentPrefix );
    fs.renameSync( path.join( ordersFolder, orderFileName ), path.join( ordersFolder, shippmentFileName ) );
    Printer.printContentToFile( this.logFileName, 'processed: ' + orderFileName );
  }

  public addProduct() { }

  public updatePurchasedProduct( purchasedProductName : string, purchasedQuantity : number ) {
    const purchasedProduct = WarehouseAdministrator.productCatalog.find( product => product.name === purchasedProductName );
    if ( this.isNotEnouht( purchasedProduct, purchasedQuantity ) ) {
      purchasedQuantity = purchasedProduct.stock;
      Printer.printContentToFile( this.logFileName, 'out of stock: ' + purchasedProduct.name );
    }
    purchasedProduct.stock = purchasedProduct.stock - purchasedQuantity;
    this.restockProduct( purchasedProductName );
  }

  private isNotEnouht( purchasedProduct : any, purchasedQuantity : number ) {
    return purchasedProduct.stock <= purchasedQuantity;
  }

  public restockProduct( productName : string ) {
    const productToRestoc = WarehouseAdministrator.productCatalog.find( product => product.name === productName );
    productToRestoc.stock = productToRestoc.minimun;
    Printer.printContentToFile( this.restockPrefix + productName + '.json', JSON.stringify( productToRestoc ) );
  }
}
