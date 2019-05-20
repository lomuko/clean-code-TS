import * as fs from 'fs';
import { Assert } from "./assert";
import * as mocks from "./mocks";

afterEach(() => {
  mocks.cleanCheckOuts();
});

describe( `As a shop owner, I want to generate orders, so I can send products to customers`, () => {
  let assert: Assert;

  const shoppingCart = mocks.newShoppingCart;
  shoppingCart.addProduct( 'computer', 1000, 1, shoppingCart.country );
  shoppingCart.addProduct( 'monitor', 200, 25, shoppingCart.country );
  shoppingCart.addProduct( 'course', 100, 10, shoppingCart.country );
  shoppingCart.calculate( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );

  const orderFilePath = mocks.orderFilePath( shoppingCart.invoiceNumber );
  assert = {
    given: 'a shopping cart with line items',
    should: `generate order after checkout in ${orderFilePath}`,
  };
  test( `given ${assert.given} should ${assert.should}`, () => {

    assert.actual = fs.existsSync(orderFilePath);
      assert.expected= true;
      expect(assert.actual).toEqual(assert.expected);
    });
  })





