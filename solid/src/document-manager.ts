import { DOCUMENT_TYPES } from './database/config/document-types';
import { DocumentType } from './models/document-type';
import { ShoppingCart } from './models/shopping-cart';
import { Checker } from './tools/checker';

export class DocumentManager {
  private readonly checker = new Checker();
  private readonly documentTypes = DOCUMENT_TYPES;

  public send( shoppingCart : ShoppingCart, typeName : string ) {
    const documentType : DocumentType = this.checker.findSafe(
      this.documentTypes,
      documentType => documentType.typeName === typeName
    );
    documentType.sender.send( shoppingCart );
  }
}
