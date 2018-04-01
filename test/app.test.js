/* eslint-disable */
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');

describe('Test app.js get index', () => {
    it('should return status 200', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end(done);
    });
})
