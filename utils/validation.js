const rules = {
    required(value, name = 'This Field') {
        return new Promise((resolve, reject) => {
            let valueStr = value.toString();
            if (valueStr.length <= 0) {
                reject(new Error(`${name} cannot be blank`));
            } else {
                resolve(true);
            }
        });
    }
};

module.exports = {
    rules
};