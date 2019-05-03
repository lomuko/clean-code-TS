export class ShoppingCart {
  public items: any[] = [];
  public totalImport: number = 0;
  public ports = 0;
  public taxes: number = 0;
  public payment: string;
  public paymentId: string;
  public shippingAddress: string;
  public billingAddress: string;

  constructor(private clientName: string, private student: boolean, private region: string, private country: string, private isVip: boolean, private taxNumber?: string, ) {}

  public addProduct(product: string, price: number, q: number) {
    this.items.push({ product, price, q });
  }

  public removeLine(p: string) {
    this.items = this.items.filter(i => i.product !== p);
  }

  public checkOut( payment: string, id: string, address: string, billing?: string ) {
    this.shippingAddress = address;
    this.billingAddress = billing || address;
    this.payment = payment;
    this.paymentId = id;

    // calculate total price
    this.items.forEach(line => {
      this.totalImport += line.price * line.q;
    });

    if ( payment == "PayPal" ) {
      this.totalImport = this.totalImport * 0.05;
    }

    // apply discount
    if (this.isVip) {
      this.totalImport *= 0.9;
    }

    // add ports
    if (this.totalImport < 100) {
      this.ports = this.totalImport * 0.1;
    } else if (this.totalImport < 1000)
      this.ports = 10;
      else
      this.ports = 0;


    // add taxes
    let countryVAT = 0;
    switch (this.country) {
      case 'Spain':
        if ( this.region == "Canary Islands" ) {
          countryVAT = 7;
        } else
        countryVAT = 21;
        break;
      case 'Portugal':
      if ( this.region == "Madeira" ) {
        countryVAT = 22;
      } else if ( this.region == "Azores" ) {
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
    this.taxes = this.student || this.region == 'St Pierre' ? 0  : ((this.totalImport + this.ports) * countryVAT) / 100;

    // save to warehouse

    // send packing list to courier
      // create document
      // send by email
    // send invoice to customer
      // create document
      // print to pdf
  }
}
