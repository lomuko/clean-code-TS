import { Assert } from './assert';
import * as mocks from './mocks';

describe( `As a customer, I want to add products to the shopping cart, so I can buy products`, () => {
  let assert : Assert;

  assert = {
    given: 'no shopping cart',
    should: 'create one'
  };
  test( `given ${assert.given} should ${assert.should}`, () => {
    assert.actual = mocks.newShoppingCart;
    assert.expected = mocks.shoppingCart;
    expect( assert.actual ).toEqual( assert.expected );
  } );

  assert = {
    given: 'a shopping cart',
    should: 'add products to it'
  };
  test( `given ${assert.given} should ${assert.should}`, () => {
    const mySC = mocks.newShoppingCart;
    mySC.addProduct( 'computer', 1000, 1, mySC.country );
    assert.actual = mySC.lineItems;
    assert.expected = [{ price: 1000, product: 'computer', q: 1 }];
    expect( assert.actual ).toEqual( assert.expected );
  } );
} );
