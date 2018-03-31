/* eslint-disable */

const adder = require('./add');

it('should add two numbers', () => {
    let result = adder(10, 10);
    if (result !== 20) {
        throw new Error(`should be 30 but get ${result}`);
    }
});
