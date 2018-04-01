const express = require('express');
const path = require('path');
const router = express.Router();
const publicPath = path.join(__dirname, '../public/index.html');

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.sendFile(publicPath);
});

module.exports = router;
