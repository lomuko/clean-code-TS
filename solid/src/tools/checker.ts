import { IFindSafe } from '../models/i-find-safe';
import { StringChecker } from './string-checker';

export class Checker extends StringChecker implements IFindSafe {
  public findSafe( target : any[], predicate : ( item : any ) => boolean, defaultValue : any = target[0] ) : any {
    const foundItem = target.find( predicate );
    if ( foundItem === undefined ) {
      return defaultValue;
    }
    return foundItem;
  }
}
