import { Warehouse } from '../warehouse';

describe('the warehouse',()=>{
    test('given the constructor should return the object', () => {
        const actual = new Warehouse();
        const expected = null;
        expect(actual).not.toEqual(expected);
    });
})


/**
 * https://medium.com/javascript-scene/rethinking-unit-test-assertions-55f59358253f
 * assert({
  given: Any,
  should: String,
  actual: Any,
  expected: Any
}) => Void
 * / */