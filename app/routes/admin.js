var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var loginReq = require('../middleware/loginReq');
var adminReq = require('../middleware/adminReq');

var Letter = require('../models/letter');
var User = require('../models/user');

router.get('/', loginReq, adminReq, function(req, res) {  
    res.sendFile('admin.html', { root: './src' });
});

module.exports = router;