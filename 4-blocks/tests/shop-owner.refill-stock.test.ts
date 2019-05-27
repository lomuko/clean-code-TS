import { Assert } from './assert';
import * as mocks from './mocks';

afterAll( () => {
  mocks.cleanCheckOuts();
} );

describe( `As a shop owner, I want to have my product stock refilled, so I can continue selling`, () => {
  let assert : Assert;

  assert = {
    given: 'a user order certain amount',
    should: 'the stock is auto-refilled'
  };
  test( `given ${assert.given} should ${assert.should}`, () => {
    const shoppingCart = mocks.newShoppingCart;
    shoppingCart.addLineItem( 'monitor', 200, 40, shoppingCart.country );
    shoppingCart.calculateCheckOut( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );

    assert.actual = mocks.theWarehouse.productCatalog[0].stock;
    assert.expected = mocks.theWarehouse.productCatalog[0].minimun;
    expect( assert.actual ).toEqual( assert.expected );
  } );
} );
