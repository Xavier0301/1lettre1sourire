var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var loginReq = require('../middleware/loginReq');

var Letter = require('../models/letter');
var User = require('../models/user');

var docBuilder = require('../afterware/docbuilder');

router.get('/', loginReq, function(req, res) {
   res.sendFile('review.html', { root: './src' });
});

router.get('/fetch', loginReq, function(req, res) {

   const errSend = (caughtErr) => {
      console.log(caughtErr);
      return res.send({exists: false});
   };
   // FIND ONE THAT IS HAS APPROVAL STATUS: 'QUEUED'
   // Letter.findOne({approvalStatus: 'QUEUED'})
   resolveInReviewStates(function(err) {
      if(err) {
         errSend(err);
      } else {
         Letter.findOneAndUpdate({approvalStatus: 'Queued'}, {approvalStatus: 'In Review', inReviewSinceDate: Date.now()}).exec(function(error, letter) {
            if(error || !letter) {
               errSend(error);
            } else {
               res.send({id: letter.id, type: letter.type, greeting: letter.heading, content: letter.content, signature: letter.signature, imageUrl: letter.imageUrl, exists: true});
            }
         });
      } 
   })
});

router.post('/approve', loginReq, function(req, res, next) {
   console.log(req.body);
   if(req.body.id && req.body.approve !== undefined && req.body.flag !== undefined) {
      var approved = Letter.getApprovedValue(req.body.approve === 'true');
      Letter.findOneAndUpdate({
         id: parseInt(req.body.id), 
         approvalStatus: 'In Review'
      }, {
         approvalStatus: approved,
         flagged: req.body.flag === 'true',
         $unset: {
            inReviewSinceDate: ""
         },
         approvedByUser: req.session.userId
      }, function(err, letter) {
         if(letter && !err) {
            res.sendStatus(200);
            if(approved) {
               docBuilder(letter);
            }

            // User.findOneAndUpdate({ _id: req.session.userId }, { $inc: { lettersCount: 1 } }, function(err, doc, res) {
            //    if(err) {
            //       console.log(err);
            //    }
            // });
         } else {
            res.send('Could not change approval status of doc. Either because it is not in review or it does not exist.');
         }
      });
      
   } else {
      var err = new Error('id, approve and flag are required for approving');
      err.status = 400;
      return next(err);
   }
});

function resolveInReviewStates(callback) {
   const fiveMinAgo = new Date( Date.now() - 1000 * 60 * 5 );
   Letter.find({ approvalStatus: 'In Review', inReviewSinceDate: { $lte: fiveMinAgo } }, function(err, results) {
      if(err) {
         callback(err); 
      } else if(!results || results.length === 0) {
         callback();
      } else {
         var resultCount = 0;
         results.map((result) => {
            Letter.updateOne({ _id: result._id }, { approvalStatus: 'Queued' }, function(err, raw) {
               if(err) {
                  return callback(err);
               } 
               resultCount++;
               if(resultCount === results.length) {
                  return callback();
               }
            });
         });
      }
   });
}

module.exports = router;