import * as fs from 'fs';
import * as path from 'path';
import { FileToPrint } from './models/file-to-print';

export class Printer {
  private static readonly dataFolder = path.join( __dirname, '..', 'data' );
  private static readonly printFolder = path.join( Printer.dataFolder, 'print' );
  public static printContentToFile( fileToPrint : FileToPrint ) {
    fileToPrint.textContent += '\n';
    Printer.ensurePrintFolder();
    Printer.appendOrCreateFile( fileToPrint );
  }

  private static ensurePrintFolder() {
    Printer.ensureFolder( Printer.dataFolder );
    Printer.ensureFolder( Printer.printFolder );
  }

  private static ensureFolder( dataFolder : string ) {
    if ( Printer.notExistsFolder( dataFolder ) ) {
      fs.mkdirSync( dataFolder );
    }
  }

  private static notExistsFolder( dataFolder : string ) {
    return !fs.existsSync( dataFolder );
  }

  private static appendOrCreateFile( fileToPrint : FileToPrint ) {
    if ( Printer.notExistsFileNameInPrintFolder( fileToPrint.fileName ) ) {
      fs.writeFileSync( Printer.getPrintFilePath( fileToPrint.fileName ), fileToPrint.textContent );
    } else {
      fs.appendFileSync( Printer.getPrintFilePath( fileToPrint.fileName ), fileToPrint.textContent );
    }
  }

  private static notExistsFileNameInPrintFolder( fileName : string ) {
    return !fs.existsSync( Printer.getPrintFilePath( fileName ) );
  }

  private static getPrintFilePath( fileName : string ) {
    return path.join( Printer.printFolder, fileName );
  }
}
