import * as fs from 'fs';
import * as path from 'path';

export class Printer {
  public static print( fileName : string, textContent : string ) {
    const printFolder = Printer.ensurePrintFolder();
    textContent += '\n';
    Printer.appendOrCreateFile( printFolder, fileName, textContent );
  }

  private static ensurePrintFolder() {
    const dataFolder = path.join( __dirname, '..', 'data' );
    const printFolder = path.join( dataFolder, 'print' );
    if ( !fs.existsSync( dataFolder ) ) {
      fs.mkdirSync( dataFolder );
    }
    if ( !fs.existsSync( printFolder ) ) {
      fs.mkdirSync( printFolder );
    }
    return ensurePrintFolder;
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
