import * as fs from 'fs';
import * as path from 'path';
export class Printer {
  public static print(fileName: string, text: string) {
    console.log(text);
    if (!fs.existsSync(path.join(__dirname, '..','data'))) {
      fs.mkdirSync(path.join(__dirname, '..','data'));
    }
    if (!fs.existsSync(path.join(__dirname, '..','data', 'print'))) {
      fs.mkdirSync(path.join(__dirname, '..','data', 'print'));
    }
    text += '\n';
    if (!fs.existsSync(path.join(__dirname, '..','data', 'print', fileName))) {
      fs.writeFileSync(path.join(__dirname, '..','data', 'print', fileName), text);
    } else {
      fs.appendFileSync(path.join(__dirname, '..','data', 'print', fileName), text);
    }
  }
}
