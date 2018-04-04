const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createAt: moment().format('hh:mm a')
    };
};

module.exports = {
    generateMessage
};