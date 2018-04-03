/* eslint-disable */
const test = require('../test');
const { expect, assert } = test;
test.should();

const { rules } = require('./validation');
// beforeEach(() => {
//     return rules.
// });

describe('Test validation rules', () => {
    it('Required with valid value should pass', () => {
        return rules.required('something', 'field name').should.eventually.equal(true);
    });
    it('Required with empty value should faild', () => {});
});