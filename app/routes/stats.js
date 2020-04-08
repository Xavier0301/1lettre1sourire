const express = require('express');
const router = express.Router();

const loginReq = require('../middleware/loginReq');
const adminReq = require('../middleware/adminReq');

const Letter = require('../models/letter');

router.get('/', loginReq, adminReq, function(req, res, next) {  

    var stats = {};
    var fieldsCount = 0;
    const totalFieldsCount = 4;

    const tryReturnStats = () => {
        console.log(fieldsCount);
        fieldsCount++;
        if(fieldsCount === totalFieldsCount) {
            res.end(JSON.stringify(stats));
        }
    };

    const handleError = () => {
        const err = new Error('Could not compute stats');
        err.status = 500;
        return next(err);
    }

    Letter.model.countDocuments({ approvalStatus: Letter.approvedValues.inReview }, function(err, count) {
        effectiveCount = count ? count : 0
        if(!err) {
            stats.inReviewCount = effectiveCount;
            tryReturnStats();
        } else {
            handleError();
        }
    });

    Letter.model.countDocuments({ approvalStatus: Letter.approvedValues.queued }, function(err, count) {
        effectiveCount = count ? count : 0
        if(!err) {
            stats.queuedCount = effectiveCount;
            tryReturnStats();
        } else {
            handleError();
        }
    });

    Letter.model.countDocuments({ approvalStatus: Letter.approvedValues.accepted }, function(err, count) {
        effectiveCount = count ? count : 0
        if(!err) {
            stats.acceptedCount = effectiveCount;
            tryReturnStats();
        } else {
            handleError();
        }
    });

    Letter.model.countDocuments({ approvalStatus: Letter.approvedValues.rejected }, function(err, count) {
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