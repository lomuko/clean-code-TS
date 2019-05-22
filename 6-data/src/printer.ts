import * as fs from 'fs';
import * as path from 'path';

export class Printer {
  public static print( fileName : string, textContent : string ) {
    textContent += '\n';
    const printFolder = Printer.ensurePrintFolder();
    Printer.appendOrCreateFile( printFolder, fileName, textContent );
  }

  private static ensurePrintFolder() {
    const dataFolder = path.join( __dirname, '..', 'data' );
    Printer.ensureFolder( dataFolder );
    const printFolder = path.join( dataFolder, 'print' );
    Printer.ensureFolder( printFolder );
    return printFolder;
  }

  private static ensureFolder( dataFolder : string ) {
    if ( !fs.existsSync( dataFolder ) ) {
      fs.mkdirSync( dataFolder );
    }
  }

  private static appendOrCreateFile(
    printFolder : string,
    fileName : string,
    textContent : string
  ) {
    if ( !fs.existsSync( path.join( printFolder, fileName ) ) ) {
      fs.writeFileSync( path.join( printFolder, fileName ), textContent );
    } else {
      fs.appendFileSync( path.join( printFolder, fileName ), textContent );
    }
  }
}
