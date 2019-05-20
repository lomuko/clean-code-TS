export class Product{
  constructor(
    public name: string,
    public price: number,
    public stock: number, minimum:number, taxFree: boolean) {
  }
}