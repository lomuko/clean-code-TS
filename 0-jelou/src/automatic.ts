import { ShoppingCart } from './shoppingcart';
import { Warehouse } from './warehouse';

const theWarehouse = new Warehouse();

const mySC = new ShoppingCart('Alberto', false, 'Galicia', 'Spain', 'alberto@code.dev', true, 'A12345678');
mySC.doc.printLog('START');
mySC.read();
mySC.addProduct('computer', 1000, 1, mySC.country);
mySC.addProduct( 'monitor', 200, 25, mySC.country );
mySC.addProduct('course', 100, 10, mySC.country);
mySC.save();
mySC.calculate('PayPal', 'x-le/159', 'One Street', 'Corp. Building');
mySC.invoice();
mySC.doc.printLog('END');

theWarehouse.processOrders();