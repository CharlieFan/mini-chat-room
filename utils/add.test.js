/* eslint-disable */
const expect = require('chai').expect;
const adder = require('./add');

describe('test adder', () => {
    let result = adder(10, 10);

    it('should add two numbers', () => {
        expect(result).to.equal(20);
    });
});

