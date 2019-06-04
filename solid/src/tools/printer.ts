import { FileToPrint } from '../models/file-to-print';
import { IHasContent } from '../models/i-has-content';
import { FileManager } from '../vendor/file-manager';
import { PathManager } from '../vendor/path-manager';
import { StringChecker } from './string-checker';

export class Printer {
  private static readonly fileManager = new FileManager();
  private static readonly pathManager = new PathManager();
  private static readonly checker : IHasContent = new StringChecker();
  private static readonly dataFolder = Printer.pathManager.dataFolder;
  private static readonly printFolder = Printer.pathManager.printFolder;

  public static printContentToFile( fileToPrint : FileToPrint ) {
    if ( Printer.checker.hasStringContent( fileToPrint.textContent ) ) {
      fileToPrint.textContent += '\n';
      Printer.ensurePrintFolder();
      Printer.appendOrCreateFile( fileToPrint );
    }
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
    return Printer.pathManager.join( Printer.printFolder, fileName );
  }
}
