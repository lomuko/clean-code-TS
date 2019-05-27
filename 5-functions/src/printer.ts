import * as fs from 'fs';
import * as path from 'path';

export class Printer {
  private static readonly dataFolder = path.join( __dirname, '..', 'data' );
  private static readonly printFolder = path.join( Printer.dataFolder, 'print' );
  public static printContentToFile( fileName : string, textContent : string ) {
    textContent += '\n';
    Printer.ensurePrintFolder();
    Printer.appendOrCreateFile( fileName, textContent );
  }

  private static ensurePrintFolder() {
    Printer.ensureFolder( Printer.dataFolder );
    Printer.ensureFolder( Printer.printFolder );
  }

  private static ensureFolder( dataFolder : string ) {
    if ( !fs.existsSync( dataFolder ) ) {
      fs.mkdirSync( dataFolder );
    }
  }

  private static appendOrCreateFile( fileName : string, textContent : string ) {
    if ( Printer.notExistsFileNameInPrintFolder( fileName ) ) {
      fs.writeFileSync( Printer.getPrintFilePath( fileName ), textContent );
    } else {
      fs.appendFileSync( Printer.getPrintFilePath( fileName ), textContent );
    }
  }

  private static notExistsFileNameInPrintFolder( fileName : string ) {
    return !fs.existsSync( Printer.getPrintFilePath( fileName ) );
  }

  private static getPrintFilePath( fileName : string ) {
    return path.join( Printer.printFolder, fileName );
  }
}
