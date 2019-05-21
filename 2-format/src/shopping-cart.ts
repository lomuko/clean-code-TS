import * as fs from 'fs';
import * as path from 'path';
import { Document } from './document';
import { Tax } from './tax';
import { Warehouse } from './warehouse';

export class ShoppingCart {
  public items: any[] = [];
  public totalAmount: number = 0;
  public shipping_cost = 0;
  public taxes: number = 0;
  public payment: string = '';
  public paymentId: string = '';
  public shippingAddress: string = '';
  public billingAddress: string = '';
  public invoiceNumber: number = 0;
  public doc = new Document();

  constructor(
    public clientName: string,
    private student: boolean,
    public region: string,
    public country: string,
    public email: string,
    private isVip: boolean,
    public taxNumber?: string
  ) {}

  public addProduct(
    product: string,
    price: number,
    q: number,
    country?: string,
    taxFree?: boolean
  ) {
    this.items.push({ product, price, q });
  }

  public removeLine(p: string) {
    this.items = this.items.filter(i => i.product !== p);
  }

  // save to read later
  public save() {
    if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'data'));
    }
    const fileName = `shopping-${this.clientName}.json`;
    if (!fs.existsSync(path.join(__dirname, '..', 'data', fileName))) {
      fs.writeFileSync(
        path.join(__dirname, '..', 'data', fileName),
        JSON.stringify(this.items)
      );
    }
  }

  // read from file
  public read() {
    const fileName = path.join(__dirname, '..', 'data', `shopping-${this.clientName}.json`);
    if (fs.existsSync(fileName)) {
      const file = fs.readFileSync(fileName, 'utf8');
      this.items = JSON.parse(file);
    }
  }
  // read from file
  public delete() {
    const fileName = path.join(__dirname, '..', 'data', `shopping-${this.clientName}.json`);
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
  }

  public calculate(payment: string, id: string, address: string, billing?: string) {
    this.shippingAddress = address;
    this.billingAddress = billing || address;
    this.payment = payment;
    this.paymentId = id;
    const w = new Warehouse();
    // calculate total price
    this.items.forEach(line => {
      w.buyProduct(line.product, line.q);
      line.totalAmount = line.price * line.q;
      this.totalAmount += line.totalAmount;
      // add taxes by product
      if (!line.taxFree) {
        line.taxes = Tax.calculateLine(line, this.country, this.region, this.student);
        this.taxes += line.taxes;
        let lineTotal = line.totalAmount + line.taxes;
      }
    });

    // add shipping costs
    if (this.totalAmount < 100) {
      switch (this.country) {
        case 'Spain':
          this.shipping_cost = this.totalAmount * 0.1;
          break;
        case 'Portugal':
          this.shipping_cost = this.totalAmount * 0.15;
          break;
        case 'France':
          this.shipping_cost = this.totalAmount * 0.2;
          break;

        default:
          this.shipping_cost = this.totalAmount * 0.25;
          break;
      }
    } else if (this.totalAmount < 1000) {
      switch (this.country) {
        case 'Spain':
          this.shipping_cost = 10;
          break;
        case 'Portugal':
          this.shipping_cost = 15;
          break;
        case 'France':
          this.shipping_cost = 20;
          break;

        default:
          this.shipping_cost = 25;
          break;
      }
    } else {
      switch (this.country) {
        case 'Spain':
          this.shipping_cost = 0;
          break;
        case 'Portugal':
          this.shipping_cost = 10;
          break;
        case 'France':
          this.shipping_cost = 15;
          break;

        default:
          this.shipping_cost = 20;
          break;
      }
    }
    this.totalAmount += this.shipping_cost;
    if (payment === 'PayPal') {
      this.totalAmount = this.totalAmount * 1.05;
    }

    // apply discount
    if (
      this.isVip ||
      (this.totalAmount > 3000 && this.country === 'Portugal') ||
      (this.totalAmount > 2000 && this.country === 'France') ||
      (this.totalAmount > 1000 && this.country === 'Spain')
    ) {
      this.totalAmount *= 0.9;
    }

    this.taxes += Tax.calculate(this.totalAmount, this.country, this.region, this.student);

    const lastInvoice = path.join(__dirname, '..', 'data', `lastinvoice.txt`);
    let number = 0;
    if (fs.existsSync(lastInvoice)) {
      number = Number.parseInt(fs.readFileSync(lastInvoice, 'utf8'));
    }
    number++;
    this.invoiceNumber = number;
    fs.writeFileSync(lastInvoice, number);
    this.savetoWarehouse();
    this.delete();
  }

  // save to process at the warehouse
  private savetoWarehouse() {
    // send packing list to courier
    const order = this.doc.order(this);
    // send by email
    this.doc.emailOrder(this, order, this.country);
  }
  // send invoice to customer
  public invoice() {
    // create document
    this.doc.sendInvoice(this);
  }
}
