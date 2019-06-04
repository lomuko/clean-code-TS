import { IHasContent } from '../models/i-has-content';
import { Printer } from './printer';
import { StringChecker } from './string-checker';
export class Logger {
  private readonly logFileName = `log.txt`;
  private readonly checker : IHasContent = new StringChecker();

  public print( logContent : string ) {
    if ( this.checker.hasStringContent( logContent ) ) {
      Printer.printContentToFile( { fileName: this.logFileName, textContent: logContent } );
    }
  }
}
