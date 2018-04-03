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
                name: 'Alice',
                channel: 'channel1'
            },
            {
                id: 2,
                name: 'Bob',
                channel: 'channel1'
            },
            {
                id: 3,
                name: 'Charlie',
                channel: 'channel2'
            }
        ];
    });


    it('Should add new user', () => {
        let myUser = {
            id: 123,
            name: 'my name',
            channel: 'my channel'
        }

        let result = testUsers.addUser(myUser.id, myUser.name, myUser.channel);
        expect(result).to.deep.equal({
            id: 123,
            name: 'my name',
            channel: 'my channel'
        })

        expect(testUsers.users).to.deep.include({
            id: 123,
            name: 'my name',
            channel: 'my channel'
        })
    });

    it('Should get user', () => {
        let gotUser = testUsers.getUser(2)
        expect(gotUser).to.deep.equal({
            id: 2,
            name: 'Bob',
            channel: 'channel1'
        })
    });

    it('should remove user', () => {
        let removed = testUsers.remove(3)
        expect(testUsers.users).to.not.include({
            id: 3,
            name: 'Charlie',
            channel: 'channel2'
        });
        expect(removed).to.deep.include({
            id: 3,
            name: 'Charlie',
            channel: 'channel2'
        });
    });
});