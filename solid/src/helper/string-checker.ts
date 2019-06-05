import { IHasContent } from '../models/i-has-content';
export class StringChecker implements IHasContent {
  public hasStringContent( content : string ) {
    return content !== undefined && content !== null && content.length > 0;
  }
}
