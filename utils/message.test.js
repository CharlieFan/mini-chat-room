/* eslint-disable */
const { expect } = require('../test');
const message = require('./message')

describe('Test Mesaage', () => {
    it('generateMessage should return a message object', () => {
        let result = message.generateMessage('admin', 'test')
        expect(result.createAt).to.be.a('number');
        expect(result).to.deep.include({
            from: 'admin',
            text: 'test'
        });
    });
});