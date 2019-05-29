import { FileManager } from './file-manager';
import { FileToPrint } from './models/file-to-print';
import { PathManager } from './path-manager';

export class Printer {
  private static readonly fileManager = new FileManager();
  private static readonly pathManager = new PathManager();
  private static readonly dataFolder = Printer.pathManager.dataFolder;
  private static readonly printFolder = Printer.pathManager.printFolder;

  public static printContentToFile( fileToPrint : FileToPrint ) {
    if ( Printer.hasContent( fileToPrint.textContent ) ) {
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
  private static hasContent( content : string ) {
    return content !== null && content.length > 0;
  }
}
