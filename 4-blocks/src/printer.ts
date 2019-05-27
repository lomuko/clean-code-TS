import * as fs from 'fs';
import * as path from 'path';

export class Printer {
  public static printContentToFile( fileName : string, textContent : string ) {
    if ( Printer.notExistsDataFolder() ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data' ) );
    }
    if ( Printer.notExistsPrintFolder() ) {
      fs.mkdirSync( path.join( __dirname, '..', 'data', 'print' ) );
    }
    textContent += '\n';
    if ( Printer.notExistsFileNameInPrintFolder( fileName ) ) {
      fs.writeFileSync( path.join( __dirname, '..', 'data', 'print', fileName ), textContent );
    } else {
      fs.appendFileSync( path.join( __dirname, '..', 'data', 'print', fileName ), textContent );
    }
  }

  private static notExistsDataFolder() {
    return !fs.existsSync( path.join( __dirname, '..', 'data' ) );
  }

  private static notExistsPrintFolder() {
    return !fs.existsSync( path.join( __dirname, '..', 'data', 'print' ) );
  }

  private static notExistsFileNameInPrintFolder( fileName : string ) {
    return !fs.existsSync( path.join( __dirname, '..', 'data', 'print', fileName ) );
  }
}
