var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');

var loginReq = require('../middleware/loginReq');
var adminReq = require('../middleware/adminReq');

const Batch = require('../models/batch');

router.get('/list', loginReq, adminReq, function(req, res) {
    Batch.find().lean().exec(function(err, results) {
        const cleanedResults = results.map(function(res) {
            return {
                type: res.type,
                index: res.index,
                letterCount: res.letterCount,
                downloaded: res.downloaded
            }
        });
        res.end(JSON.stringify(cleanedResults));
    });
});

router.get('/download', loginReq, adminReq, function(req, res, next) {
    if(req.body.index && req.body.type) {
        Batch.exists({ index: parseInt(req.body.index), type: req.body.type }).exec(function(err, exists) {
            if(err) {
                console.log(err);
            } else {
                if(exists) {
                    var data = fs.createReadStream('./public/modules/datacollectors/output.pdf');
                    res.contentType('applicaton/pdf');
                    res.send(data);
                } else {
                    var error = new Error('Batch of such id and type do not exist.');
                    error.status = 400;
                    return next(error);
                }
            }
        });
    } else {
        var error = new Error('index and type fields are required to download a batch.');
        error.status = 400;
        return next(error);
    }
});

module.exports = router;