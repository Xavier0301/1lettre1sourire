var express = require('express');
var router = express.Router();

var loginReq = require('../middleware/loginReq');
var adminReq = require('../middleware/adminReq');

router.post('/list', loginReq, adminReq, function(req, res) {

});

router.post('/download', loginReq, adminReq, function(req, res) {
    if(req.body.index && req.body.type) {

    }
});

module.exports = router;