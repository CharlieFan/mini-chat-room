// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name) {
        let user = {
            id,
            name
        };

        this.users.push(user);
        return user;
    }

    remove(id) {
        this.users = this.users.map((user) => {
            if (user.id !== id) {
                return user;
            }
        });
    }

    getUser(id) {
        return this.users.filter((user) => {
            return user.id === id;
        })[0];
    }
}

class Person {
    constructor(name, gender) {
        this.name = name; 
        this.gender = gender; 
    }

    getUserDescription() {
        return `${this.name} is ${this.gender}`;
    }
}

module.exports = {
    Person,
    Users
};