import * as fs from 'fs';
import { Assert } from "./assert";
import * as mocks from "./mocks";

afterAll(() => {
  mocks.cleanCheckOuts();
});

describe(`As a shop owner, I want to generate invoices, so I can legally sell products`,()=>{
    let assert:Assert;

    assert = {
        given: 'a shopping cart already ordered',
        should:'generate invoice and send to customer email address',
      };
    test(`given ${assert.given} should ${assert.should}`, () => {
      const shoppingCart = mocks.newShoppingCart;
      shoppingCart.addProduct('computer', 1000, 1, shoppingCart.country);
      shoppingCart.addProduct( 'monitor', 200, 25, shoppingCart.country );
      shoppingCart.addProduct('course', 100, 10, shoppingCart.country);
      shoppingCart.calculate( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );
      shoppingCart.invoice();
      assert.actual=  fs.existsSync(mocks.invoiceFilePath());
      assert.expected= true;
      expect(assert.actual).toEqual(assert.expected);
    } );

    assert = {
      given: 'a shopping cart already ordered',
      should:`print invoice`,
    };
  test(`given ${assert.given} should ${assert.should}`, () => {
    const shoppingCart = mocks.newShoppingCart;
    shoppingCart.addProduct('computer', 1000, 1, shoppingCart.country);
    shoppingCart.addProduct( 'monitor', 200, 25, shoppingCart.country );
    shoppingCart.addProduct('course', 100, 10, shoppingCart.country);
    shoppingCart.calculate( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );
    shoppingCart.invoice();
    assert.actual=  fs.existsSync(mocks.invoicePrintingFilePath(shoppingCart.invoiceNumber));
    assert.expected= true;
    expect(assert.actual).toEqual(assert.expected);
  });





})


