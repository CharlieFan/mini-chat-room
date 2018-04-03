/* eslint-disable */
const test = require('../test');
const { expect } = test;
test.should();

const {Users} = require('./users');

describe('Users', () => {
    let testUsers = new Users();
    beforeEach(() => {
        testUsers.users = [
            {
                id: 1,
                name: 'Alice'
            },
            {
                id: 2,
                name: 'Bob'
            },
            {
                id: 3,
                name: 'Charlie'
            }
        ];
    });


    it('Should add new user', () => {
        let myUser = {
            id: 123,
            name: 'my name'
        }

        let result = testUsers.addUser(myUser.id, myUser.name);
        expect(result).to.deep.equal({
            id: 123,
            name: 'my name'
        })

        expect(testUsers.users).to.deep.include({
            id: 123,
            name: 'my name'
        })
    });

    it('Should get user', () => {
        let gotUser = testUsers.getUser(2)
        expect(gotUser).to.deep.equal({
            id: 2,
            name: 'Bob'
        })
    });

    it('should remove user', () => {
        testUsers.remove(3)
        expect(testUsers.users).to.not.include({
            id: 3,
            name: 'Charlie'
        })
    });
});