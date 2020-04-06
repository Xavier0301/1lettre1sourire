var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');

var loginReq = require('../middleware/loginReq');
var adminReq = require('../middleware/adminReq');

const Batch = require('../models/batch');

router.get('/list', loginReq, adminReq, function(req, res, next) {
    Batch.find().lean().exec(function(err, results) {
        if(err) {
            console.log(err);
            var error = new Error('Could not get batches list.');
            error.status = 500;
            return next(error);
        } else {
            const cleanedResults = results.map(function(result) {
                return {
                    type: result.type,
                    index: result.index,
                    letterCount: result.letterCount,
                    downloaded: result.downloaded
                }
            });
            res.end(JSON.stringify(cleanedResults));
        }
    });
});

router.get('/download', loginReq, adminReq, function(req, res, next) {
    if(req.query.index && req.query.type) {
        Batch.findOne({ index: parseInt(req.query.index), type: req.query.type }, function(err, batch) {
            if(err) {
                console.log(err);
            } else {
                if(batch) {
                    const filePath = path.resolve(`docs/${batch.associatedFileName}`);
                    res.download(filePath, function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            Batch.findOneAndUpdate({ index: parseInt(req.query.index), type: req.query.type }, { downloaded: true }, function(err, doc, res) {
                                if(err) {
                                    console.log(err);
                                }
                            })
                        }
                    });
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