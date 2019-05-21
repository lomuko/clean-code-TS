export class Product {
  constructor(
    public name : string,
    public price : number,
    public stock : number,
    minimumStock : number,
    isTaxFree : boolean
  ) { }
}
