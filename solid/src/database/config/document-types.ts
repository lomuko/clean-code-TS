import { InvoiceSender } from '../../lib/invoice-sender';
import { OrderSender } from '../../lib/order-sender';
import { DocumentType } from '../../models/document-type';
import { ShoppingCart } from '../../models/shopping-cart';

export const DOCUMENT_TYPES : DocumentType[] = [
  {
    typeName: '*default*',
    prefix: '-',
    sender: {
      send( shoppingCart : ShoppingCart ) {
        shoppingCart;
      }
    }
  },
  {
    typeName: 'order',
    prefix: 'order-',
    sender: new OrderSender()
  },
  {
    typeName: 'invoice',
    prefix: 'invoice-',
    sender: new InvoiceSender()
  }
];
