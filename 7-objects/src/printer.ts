import * as path from 'path';
import { FileManager } from './file-manager';
import { FileToPrint } from './models/file-to-print';

export class Printer {
  private static readonly dataFolder = path.join( __dirname, '..', 'data' );
  private static readonly printFolder = path.join( Printer.dataFolder, 'print' );
  private static readonly fileManager = new FileManager();
  public static printContentToFile( fileToPrint : FileToPrint ) {
    fileToPrint.textContent += '\n';
    Printer.ensurePrintFolder();
    Printer.appendOrCreateFile( fileToPrint );
  }

  private static ensurePrintFolder() {
    Printer.fileManager.ensureFolder( Printer.dataFolder );
    Printer.fileManager.ensureFolder( Printer.printFolder );
  }

  private static appendOrCreateFile( fileToPrint : FileToPrint ) {
    const fileContent = {
      path: Printer.getPrintFilePath( fileToPrint.fileName ),
      content: fileToPrint.textContent
    };
    Printer.fileManager.appendFile( fileContent );
  }

  private static getPrintFilePath( fileName : string ) {
    return path.join( Printer.printFolder, fileName );
  }
}
