import { IDocumentSender } from './i-document-sender';
export interface DocumentType {
  typeName : string;
  prefix? : string;
  sender : IDocumentSender;
}
