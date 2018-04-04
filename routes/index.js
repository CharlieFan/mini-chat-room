const express = require('express');
// const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Join A Channel',
        heading: 'Welcome to Mini Chat',
        description: 'Mini Chat is a chat room demo app by using socket.io'
    });
});

/* GET Chat app */
router.get('/app', function(req, res, next) {
    res.render('app', { title: 'Mini Chat' });
});

module.exports = router;
