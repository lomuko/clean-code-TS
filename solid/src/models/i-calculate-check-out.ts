export interface ICalculateCheckOut {
  calculateShippingCosts() : void;
  applyPaymentMethodExtra( payment : string ) : void;
  applyDiscount() : void;
}
