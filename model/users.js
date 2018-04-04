class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, channel) {
        let user = {
            id,
            name,
            channel
        };

        this.users.push(user);
        return user;
    }

    remove(id) {
        let removed = this.getUser(id);
        this.users = this.users.filter((user) => {
            return user.id !== id;
        });
        

        return removed;
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