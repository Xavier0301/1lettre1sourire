var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var loginReq = require('../middleware/loginReq');
var adminReq = require('../middleware/adminReq');

var Letter = require('../models/letter');
var User = require('../models/user');

router.get('/', loginReq, adminReq, function(req, res) {  
    res.send("Admin page");
});

router.post('/batchDownload', loginReq, adminReq, function(req, res) {
    
});

module.exports = router;