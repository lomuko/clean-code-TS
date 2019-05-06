import * as fs from 'fs';

export class ShoppingCart {
  public items: any[] = [];
  public totalImport: number = 0;
  public ports = 0;
  public taxes: number = 0;
  public payment: string;
  public paymentId: string;
  public shippingAddress: string;
  public billingAddress: string;
  public invoiceNumber: number;
  public doc = new Document();

  constructor(public clientName: string, private student: boolean, public region: string, public country: string, private isVip: boolean, public taxNumber?: string, ) {}

  public addProduct(product: string, price: number, q: number) {
    this.items.push({ product, price, q });
  }

  public removeLine(p: string) {
    this.items = this.items.filter(i => i.product !== p);
  }



  // save to read later
  public save() {
    if ( ! fs.existsSync( `${this.clientName}.json` ) ) {
      fs.writeFileSync( `${this.clientName}.json`, JSON.stringify( this.items ) );
    }
  }
  // read from file
  public read() {
    if ( fs.existsSync( `${this.clientName}.json` ) ) {
      const file = fs.readFileSync( `${this.clientName}.json`, 'utf8' );
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
      line.totalImport =line.price * line.q;
      this.totalImport += line.totalImport;
      console.log( this.totalImport );
          // add taxes by product

      line.taxes = Tax.calculateLine( line, this.country, this.region, this.student );
      this.taxes += line.taxes;
      console.log( this.totalImport  );
    });


    console.log( this.totalImport  );
    // add ports
    if (this.totalImport < 100) {
      this.ports = this.totalImport * 0.1;
    } else if (this.totalImport < 1000)
      this.ports = 10;
      else
      this.ports = 0;

      if ( payment == "PayPal" ) {
        this.totalImport = this.totalImport * 1.05;
      }

      // apply discount
      if (this.isVip || (this.totalImport>3000 && this.country=='Portugal') || (this.totalImport>2000 && this.country=='France' ) || (this.totalImport>1000 && this.country=='France' )) {
        this.totalImport *= 0.9;
      }

    this.taxes +=   Tax.calculate( this.totalImport, this.country, this.region, this.student );

    this.invoiceNumber = 1 + Math.round((Math.random() * 100));
    this.savetoWarehouse();
  }

  // save to process at the warehouse
  private savetoWarehouse() {

      // send packing list to courier
      const order = this.doc.order( this );
        // send by email
    this.doc.email( order );

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
    Invoice Number: ${shoppingCart.invoiceNumber}#
    ${shoppingCart.clientName} - ${shoppingCart.taxNumber}
    ${shoppingCart.billingAddress}
    ${shoppingCart.country} - ${shoppingCart.region}
    Items purchased:
    ${this.lines( shoppingCart )}
    Base: #${shoppingCart.totalImport + shoppingCart.ports}Euros
    Tax: #${shoppingCart.taxes}Euros
    Total: #${shoppingCart.totalImport + shoppingCart.ports + shoppingCart.taxes}Euros
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

  print( doc ) {
    if(doc)
    Printer.print( doc );
  }
  email( doc ) {
    const warehouse = this.getAddress(doc.country);
    console.log( 'Sending email to ' + warehouse );
    const message = `
    ---
    Serve this order ASAP.
    ---
    ${doc}
    ---
    Regards, the shop.com`;
    console.table( message );
  }
  private getAddress(country) {
    if ( country == "Spain" ) {
      return 'warehouse@acme.es'
    }
    return 'warehouse@acme.com';
  }
}

export class Printer{
  public static print(text) {
    console.log( text );
  }
}

export class Tax {
  static calculateLine(line, country, region, student) {
      return student || region == 'St Pierre' ? 0 : line.totalImport * Tax.coutryTax(country,region) / 100;
  }
  static calculate(base, country, region, student) {

      return student || region == 'St Pierre' ? 0 : base * Tax.coutryTax(country,region) / 100;
  }

  private static coutryTax(country, region) {
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
mySC.addProduct( 'computer', 1000, 1 );
mySC.addProduct( 'monitor', 200, 2 );
mySC.save();
mySC.calculate( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );
mySC.invoice();
mySC.doc.print( 'END' );
