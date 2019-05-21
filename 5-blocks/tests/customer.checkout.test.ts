import { Assert } from './assert';
import * as mocks from './mocks';

afterEach( () => {
  mocks.cleanCheckOuts();
} );

describe( `As a customer, I want to check out, so I can pay and get the products`, () => {
  let assert : Assert;

  const shoppingCart = mocks.newShoppingCart;

  assert = {
    given: 'a shopping cart',
    should: 'calculate check out'
  };
  test( `given ${assert.given} should ${assert.should}`, () => {
    shoppingCart.addLineItem( 'computer', 1000, 1, shoppingCart.country );
    shoppingCart.addLineItem( 'monitor', 200, 25, shoppingCart.country );
    shoppingCart.addLineItem( 'course', 100, 10, shoppingCart.country );
    shoppingCart.calculate( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );
    assert.actual = shoppingCart.totalAmount;
    assert.expected = 6615;
    expect( assert.actual ).toEqual( assert.expected );
  } );

  assert = {
    given: 'a shopping cart',
    should: 'have an invoice number'
  };
  test( `given ${assert.given} should ${assert.should}`, () => {
    shoppingCart.calculate( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );
    assert.actual = shoppingCart.invoiceNumber;
    assert.expected = 0;
    expect( assert.actual ).toBeGreaterThan( assert.expected );
  } );
} );
