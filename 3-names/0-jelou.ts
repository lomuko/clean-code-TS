import * as fs from 'fs';
import * as path from 'path';

export class ShoppingCart {
  public items: any[] = [];
  public totalAmount: number = 0;
  public ports = 0;
  public taxes: number = 0;
  public payment: string='';
  public paymentId: string='';
  public shippingAddress: string='';
  public billingAddress: string='';
  public invoiceNumber: number=0;
  public doc = new Document();

  constructor(public clientName: string, private student: boolean, public region: string, public country: string, private isVip: boolean, public taxNumber?: string, ) {}

  public addProduct( product: string, price: number, q: number, country?: string ) {
    this.items.push({ product, price, q });
  }

  public removeLine(p: string) {
    this.items = this.items.filter(i =>i.product != p);
  }



  // save to read later
  public save() {
    const fileName = `${this.clientName}.json`;
    if ( ! fs.existsSync( path.join(__dirname, fileName)) ) {
      fs.writeFileSync( path.join(__dirname, fileName), JSON.stringify( this.items ) );
    }
  }

  // read from file
  public read() {
    const fileName = path.join( __dirname, `${this.clientName}.json` );
    if ( fs.existsSync( fileName ) ) {
      const file = fs.readFileSync(fileName, 'utf8' );
      this.items = JSON.parse( file );
    }
  }

  public calculate( payment: string, id: string, address: string, billing?: string ) {
    this.shippingAddress = address;
    this.billingAddress = billing || address;
    this.payment = payment;
    this.paymentId = id;

    // calculate total price
    this.items.forEach(line => {
      line.totalAmount =line.price * line.q;
      this.totalAmount += line.totalAmount;
      console.log( this.totalAmount );
          // add taxes by product

      line.taxes = Tax.calculateLine( line, this.country, this.region, this.student );
      this.taxes += line.taxes;
      let lineTotal = line.totalAmount + line.taxes;
      console.log( this.totalAmount  );
    });


    console.log( this.totalAmount  );
    // add ports
    if (this.totalAmount < 100) {
      this.ports = this.totalAmount * 0.1;
    } else if (this.totalAmount < 1000)
      this.ports = 10;
      else
      this.ports = 0;

      if ( payment == "PayPal" ) {
        this.totalAmount = this.totalAmount * 1.05;
      }

      // apply discount
      if (this.isVip || (this.totalAmount>3000 && this.country=='Portugal') || (this.totalAmount>2000 && this.country=='France' ) || (this.totalAmount>1000 && this.country=='France' )) {
        this.totalAmount *= 0.9;
      }

    this.taxes +=   Tax.calculate( this.totalAmount, this.country, this.region, this.student );

    this.invoiceNumber = 1 + Math.round((Math.random() * 100));
    this.savetoWarehouse();
  }

  // save to process at the warehouse
  private savetoWarehouse() {

      // send packing list to courier
      const order = this.doc.order( this );
        // send by email
    this.doc.email( order, this.country );

  }
  // send invoice to customer
  public invoice() {

    // create document
    this.doc.sendInvoice( this );

  }
}

export class Document{

  sendInvoice(shoppingCart:ShoppingCart) {
    const invoice = `
    LEGAL INVOICE FROM acme!
    ========================
    Invoice Number: ${shoppingCart.invoiceNumber}#
    ----------------------------------------------
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.billingAddress}
    ${shoppingCart.country} - ${shoppingCart.region}
    Items purchased:
    ${this.lines( shoppingCart )}
    Base Amount: #${shoppingCart.totalAmount + shoppingCart.ports}Euros
    Tax: #${shoppingCart.taxes}Euros
    Total Amount: #${shoppingCart.totalAmount + shoppingCart.ports + shoppingCart.taxes}Euros
    `;
    this.print( invoice );
  }

  private lines(shoppingCart:ShoppingCart) {
    return JSON.stringify( shoppingCart.items );
  }


  order(shoppingCart:ShoppingCart) {
    return `
    Invoice Number: ${shoppingCart.invoiceNumber}
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.shippingAddress}
    Items purchased:
    ${this.lines(shoppingCart)}
    `
  }

  print( doc: string ) {
    if(doc)
    Printer.print( doc );
  }
  email( doc: string, country:string ) {
    const warehouse = this.getAddress(country);
    console.log( 'Sending email to ' + warehouse );
    const message = `
    ---
    Serve this order ASAP.
    ---
    ${doc}
    Regards, the shop.acme.com
    ---`;
    console.table( message );
  }
  private getAddress(country: string) {
    if ( country == "Spain" ) {
      return 'warehouse@acme.es'
    }
    return "warehouse@acme.com";
  }
}

export class Printer{
  public static print(text: string) {
    console.log( text );
  }
}

export class Tax {
  static calculateLine(line: any, country: string, region: string, student: boolean) {
      return (student || region == 'St Pierre') ? 0 : Number((line.totalAmount * Tax.coutryTax(country,region) / 100).toFixed(2));
  }
  static calculate(base: number, country: string, region: string, student: boolean) {

      return (student || region == 'St Pierre') ? 0 : Number(( base * Tax.coutryTax(country,region) / 100).toFixed(2));
  }

  private static coutryTax(country: string, region: string) {
    let countryVAT = 0;
    switch (country) {
      case 'Spain':
        if ( region == "Canary Islands" ) {
            countryVAT = 7;
        } else
        countryVAT = 21;
        break;
      case 'Portugal':
      if ( region == "Madeira" ) {
        countryVAT = 22;
      } else if ( region == "Azores" ) {
        countryVAT = 18;
      }
        countryVAT = 23;
        break;
      case 'France':
        countryVAT = 20;
        break;
      default:
        break;
    }
    return countryVAT;
  }
}


const mySC = new ShoppingCart( 'Alberto', false, "Galicia", "Spain", true, 'A12345678' );
mySC.doc.print( 'START' );
mySC.read();
  mySC.addProduct( 'computer', 1000, 1 , mySC.country);
  mySC.addProduct( 'monitor', 200, 2,  mySC.country );
mySC.save();
    mySC.calculate( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );
mySC.invoice();
mySC.doc.print( 'END' );
