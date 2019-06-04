import { ShoppingCart } from './shopping-cart';
export interface IDocumentSender {
  send( shoppingCart : ShoppingCart ) : void;
}
