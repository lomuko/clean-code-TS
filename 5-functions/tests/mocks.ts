import * as fs from 'fs';
import * as path from 'path';
import { DocumentManager } from '../src/document-manager';
import { ShoppingCart } from '../src/shopping-cart';
import { WarehouseAdministrator } from '../src/warehouse-administrator';

export const newShoppingCart = new ShoppingCart( 'Alberto', false, 'Galicia', 'Spain', 'alberto@code.dev', true, 'A12345678' );

export const theWarehouse = WarehouseAdministrator;
export const oneWarehouse = new WarehouseAdministrator();

export const shoppingCart = {
  clientName: 'Alberto',
  isStudent: false,
  region: 'Galicia',
  country: 'Spain',
  email: 'alberto@code.dev',
  isVip: true,
  taxNumber: 'A12345678',
  lineItems: [],
  totalAmount: 0,
  shippingCost: 0,
  taxesAmount: 0,
  paymentMethod: '',
  paymentId: '',
  shippingAddress: '',
  billingAddress: '',
  invoiceNumber: 0,
  lastinvoiceFileName: 'lastinvoice.txt',
  paymentMethodExtra: 'PayPal',
  shoppingPrefix: 'shopping-',
  documentManager: new DocumentManager()
};

const dataFolder = path.join( __dirname, '..', 'data' );
const emailFolder = path.join( dataFolder, 'email' );
const printFolder = path.join( dataFolder, 'print' );

export const shoppingCartFilePath = path.join( dataFolder, `shopping-${shoppingCart.clientName}.json` );

export const orderFilePath = ( invoiceNumber : number ) => path.join( emailFolder, `order-${invoiceNumber}_warehouse@acme.es.txt` );

export const shipmentFilePath = ( invoiceNumber : number ) =>
  path.join( emailFolder, `shipment-${invoiceNumber}_warehouse@acme.es.txt` );

export const invoiceFilePath = () => path.join( emailFolder, `invoice-${shoppingCart.email}.txt` );

export const invoicePrintingFilePath = ( invoiceNumber : number ) => path.join( printFolder, `invoice-${invoiceNumber}.txt` );

export function cleanShoppingCart() {
  if ( fs.existsSync( shoppingCartFilePath ) ) {
    fs.unlinkSync( shoppingCartFilePath );
  }
}

export function cleanCheckOuts() {
  rimraf( emailFolder );
  rimraf( printFolder );
}

function rimraf( dirPath : string ) {
  if ( fs.existsSync( dirPath ) ) {
    fs.readdirSync( dirPath ).forEach( function( entry ) {
      var entryPath = path.join( dirPath, entry );
      if ( fs.lstatSync( entryPath ).isDirectory() ) {
        rimraf( entryPath );
      } else {
        try {
          fs.unlinkSync( entryPath );
        } catch ( error ) { }
      }
    } );
    try {
      fs.rmdirSync( dirPath );
    } catch ( error ) {
      rimraf( dirPath );
    }
  }
}
