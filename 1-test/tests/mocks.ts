import * as fs from 'fs';
import * as path from 'path';
import { ShoppingCart } from '../src/shoppingcart';
import { Warehouse } from '../src/warehouse';

export const newShoppingCart = new ShoppingCart(
  'Alberto',
  false,
  'Galicia',
  'Spain',
  'alberto@code.dev',
  true,
  'A12345678'
);

export const theWarehouse = Warehouse;
export const oneWarehouse = new Warehouse();

export const shoppingCart = {
  clientName: 'Alberto',
  student: false,
  region: 'Galicia',
  country: 'Spain',
  email: 'alberto@code.dev',
  isVip: true,
  taxNumber: 'A12345678',
  items: [],
  totalAmount: 0,
  shipping_cost: 0,
  taxes: 0,
  payment: '',
  paymentId: '',
  shippingAddress: '',
  billingAddress: '',
  invoiceNumber: 0,
  doc: {}
};

const dataFolder = path.join(__dirname, '..', 'data');
const emailFolder = path.join(dataFolder, 'email');
const printFolder = path.join(dataFolder, 'print');

export const shoppingCartFilePath = path.join(
  dataFolder,
  `shopping-${shoppingCart.clientName}.json`
);

export const orderFilePath = (invoiceNumber: number) =>
  path.join(emailFolder, `order-${invoiceNumber}_warehouse@acme.es.txt`);

export const shipmentFilePath = (invoiceNumber: number) =>
  path.join(emailFolder, `shipment-${invoiceNumber}_warehouse@acme.es.txt`);

export const invoiceFilePath = () =>
  path.join(emailFolder, `invoice-${shoppingCart.email}.txt`);

export const invoicePrintingFilePath = (invoiceNumber: number) =>
  path.join(printFolder, `invoice-${invoiceNumber}.txt`);

export function cleanShoppingCart() {
  if (fs.existsSync(shoppingCartFilePath)) {
    rimraf(shoppingCartFilePath);
  }
}

export function cleanCheckOuts() {
  rimraf(emailFolder);
  rimraf(printFolder);
}

function rimraf(dir_path: string) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function(entry) {
      var entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    try {
      fs.rmdirSync(dir_path);
    } catch (e) {
      rimraf(dir_path);
    }
  }
}
