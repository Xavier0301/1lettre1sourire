var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var loginReq = require('../middleware/loginReq');
var adminReq = require('../middleware/adminReq');

var Letter = require('../models/letter');
var User = require('../models/user');
var Batch = require('../models/batch');

router.get('/', loginReq, adminReq, function(req, res, next) {  

    var stats = {};
    var fieldsCount = 0;

    const tryReturnStats = () => {
        console.log(fieldsCount);
        fieldsCount++;
        if(fieldsCount === 4) {
            res.end(JSON.stringify(stats));
        }
    };

    const handleError = () => {
        const err = new Error('Could not compute stats');
        err.status = 500;
        return next(err);
    }

    Letter.countDocuments({ approvalStatus: 'In Review' }, function(err, count) {
        effectiveCount = count ? count : 0
        if(!err) {
            stats.inReviewCount = effectiveCount;
            tryReturnStats();
        } else {
            handleError();
        }
    });

    Letter.countDocuments({ approvalStatus: 'In Queue' }, function(err, count) {
        effectiveCount = count ? count : 0
        if(!err) {
            stats.queuedCount = effectiveCount;
            tryReturnStats();
        } else {
            handleError();
        }
    });

    Letter.countDocuments({ approvalStatus: 'Accepted' }, function(err, count) {
        effectiveCount = count ? count : 0
        if(!err) {
            stats.acceptedCount = effectiveCount;
            tryReturnStats();
        } else {
            handleError();
        }
    });

    Letter.countDocuments({ approvalStatus: 'Rejected' }, function(err, count) {
        effectiveCount = count ? count : 0
        if(!err) {
            stats.rejectedCount = effectiveCount;
            tryReturnStats();
        } else {
            handleError();
        }
    });
});

module.exports = router;