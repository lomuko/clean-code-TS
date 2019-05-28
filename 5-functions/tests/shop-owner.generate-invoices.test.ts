import * as fs from 'fs';
import { Assert } from './assert';
import * as mocks from './mocks';

afterAll( () => {
  mocks.cleanCheckOuts();
} );

describe( `As a shop owner, I want to generate invoices, so I can legally sell products`, () => {
  let assert : Assert;
  const shoppingCart = mocks.newShoppingCart;
  shoppingCart.addLineItem( 'computer', 1000, 1, shoppingCart.country );
  shoppingCart.addLineItem( 'monitor', 200, 25, shoppingCart.country );
  shoppingCart.addLineItem( 'course', 100, 10, shoppingCart.country );
  shoppingCart.calculateCheckOut( 'PayPal', 'x-le/159', 'One Street', 'Corp. Building' );
  shoppingCart.sendInvoiceToCustomer();
  const invoiceFilePath = mocks.invoiceFilePath();
  const invoicePrintingFilePath = mocks.invoicePrintingFilePath( shoppingCart.invoiceNumber );

  assert = {
    given: 'a shopping cart already ordered',
    should: `generate invoice and send to customer email address on ${invoiceFilePath}`
  };
  test( `given ${assert.given} should ${assert.should}`, () => {
    assert.actual = fs.existsSync( invoiceFilePath );
    assert.expected = true;
    expect( assert.actual ).toEqual( assert.expected );
  } );

  assert = {
    given: 'a shopping cart already ordered',
    should: `print invoice on ${invoicePrintingFilePath}`
  };
  test( `given ${assert.given} should ${assert.should}`, () => {
    assert.actual = fs.existsSync( invoicePrintingFilePath );
    assert.expected = true;
    expect( assert.actual ).toEqual( assert.expected );
  } );
} );
