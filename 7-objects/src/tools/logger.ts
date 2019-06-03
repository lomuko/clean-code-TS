import { Printer } from './printer';
export class Logger {
  private readonly logFileName = `log.txt`;

  public print( logContent : string ) {
    if ( this.hasContent( logContent ) ) {
      Printer.printContentToFile( { fileName: this.logFileName, textContent: logContent } );
    }
  }

  private hasContent( content : string ) {
    return content !== null && content.length > 0;
  }
}
