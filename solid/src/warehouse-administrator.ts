import { PRODUCT_CATALOG } from './database/product-catalog';
import { Logger } from './helper/logger';
import { Printer } from './helper/printer';
import { LineItem } from './models/line-item';
import { Product } from './models/product';

export class WarehouseAdministrator {
  private static productCatalog : Product[] = PRODUCT_CATALOG;
  private readonly restockPrefix = `restock-`;
  private readonly logger = new Logger();
  private stock : any[] = [];

  private static findProductByName( productName : string ) {
    return WarehouseAdministrator.productCatalog.find( product => product.name === productName );
  }

  public addProduct() { }

  public updatePurchasedProduct( purchasedItem : LineItem ) {
    const purchasedProduct = WarehouseAdministrator.findProductByName( purchasedItem.productName );
    if ( purchasedProduct !== undefined ) {
      let realPurchasedQuantity = this.getRealPurchasedQuantity( purchasedProduct, purchasedItem.quantity );
      this.updateStock( purchasedProduct, realPurchasedQuantity );
      return realPurchasedQuantity;
    } else {
      return 0;
    }
  }

  private getRealPurchasedQuantity( purchasedProduct : Product, quantity : number ) {
    let realPurchasedQuantity = quantity;
    if ( this.isNotEnouht( purchasedProduct, quantity ) ) {
      this.logger.print( 'not have enough: ' + purchasedProduct.name );
      realPurchasedQuantity = purchasedProduct.stock;
    }
    return realPurchasedQuantity;
  }

  private updateStock( purchasedProduct : any, realPurchasedQuantity : number ) {
    purchasedProduct.stock = purchasedProduct.stock - realPurchasedQuantity;
    if ( this.isOutOfStock( purchasedProduct ) ) {
      this.restockProduct( purchasedProduct );
    }
    return realPurchasedQuantity;
  }

  private isNotEnouht( purchasedProduct : Product, quantity : number ) {
    return purchasedProduct.stock <= quantity;
  }

  private isOutOfStock( purchasedProduct : Product ) {
    return purchasedProduct.stock < purchasedProduct.minimumStock;
  }

  private restockProduct( productToRestoc : Product ) {
    productToRestoc.stock = productToRestoc.minimumStock;
    const fileToPrint = {
      fileName: this.restockPrefix + productToRestoc.name + '.json',
      textContent: JSON.stringify( productToRestoc )
    };
    Printer.printContentToFile( fileToPrint );
  }
}
