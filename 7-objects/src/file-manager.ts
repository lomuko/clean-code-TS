import * as fs from 'fs';
import { FileContent } from './models/file-content';

export class FileManager {
  public writeFile( fileContent : FileContent ) {
    if ( !fs.existsSync( fileContent.path ) ) {
      fs.writeFileSync( fileContent.path, fileContent.content );
    }
  }

  public appendFile( fileContent : FileContent ) {
    if ( !fs.existsSync( fileContent.path ) ) {
      fs.writeFileSync( fileContent.path, fileContent.content );
    } else {
      fs.appendFileSync( fileContent.path, fileContent.content );
    }
  }

  public readFile( fileContent : FileContent ) {
    fileContent.content = '';
    if ( fs.existsSync( fileContent.path ) ) {
      try {
        fileContent.content = fs.readFileSync( fileContent.path, 'utf8' );
      } catch ( error ) { }
    }
  }

  public deleteFile( filePath : string ) {
    if ( fs.existsSync( filePath ) ) {
      fs.unlinkSync( filePath );
    }
  }

  public renameFile( oldPath : string, newName : string ) {
    fs.renameSync( oldPath, newName );
  }

  public ensureFolder( folderPath : string ) {
    if ( !fs.existsSync( folderPath ) ) {
      fs.mkdirSync( folderPath );
    }
  }

  public readFolderFileList( folderPath : string ) {
    if ( fs.existsSync( folderPath ) ) {
      return fs.readdirSync( folderPath );
    } else {
      return [];
    }
  }
}
