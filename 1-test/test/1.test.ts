import { ShoppingCart } from '../shoppingcart';
import { Warehouse } from '../warehouse';

describe('the warehouse',()=>{
    const assert1 = {
        given: 'the constructor',
        should:'return the object',
        actual:  new Warehouse(),
        expected: null
      };
    test(`given ${assert1.given} should ${assert1.should}`, () => {
        expect(assert1.actual).not.toEqual(assert1.expected);
    });

    const assert2 = {
        given: 'customer data',
        should:'return shopping cart',
        actual: new ShoppingCart('Alberto', false, 'Galicia', 'Spain', 'alberto@code.dev', true, 'A12345678'),
        expected: {"clientName":"Alberto","student":false,"region":"Galicia","country":"Spain","email":"alberto@code.dev","isVip":true,"taxNumber":"A12345678","items":[],"totalAmount":0,"ports":0,"taxes":0,"payment":"","paymentId":"","shippingAddress":"","billingAddress":"","invoiceNumber":0,"doc":{}}
      };
    test(`given ${assert2.given} should ${assert2.should}`, () => {
        console.log(JSON.stringify(assert2.actual));
        expect(assert2.actual).toEqual(assert2.expected);
    });
})


