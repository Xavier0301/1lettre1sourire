const express = require('express');
const router = express.Router();

const loginReq = require('../middleware/loginReq');

const Letter = require('../models/letter');
const User = require('../models/user');

const docBuilder = require('../afterware/docbuilder');

router.get('/', loginReq, function(req, res) {
   res.sendFile('review.html', { root: './src' });
});

router.get('/fetch', loginReq, function(req, res) {

   const errSend = (caughtErr) => {
      console.log(caughtErr);
      return res.send({exists: false});
   };
   // FIND ONE THAT IS HAS APPROVAL STATUS: 'QUEUED'
   resolveInReviewStates(function(err) {
      if(err) {
         errSend(err);
      } else {
         Letter.model.findOneAndUpdate({approvalStatus: Letter.approvedValues.queued}, {approvalStatus: Letter.approvedValues.inReview, inReviewSinceDate: Date.now()}).exec(function(error, letter) {
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
      var approved = Letter.model.getApprovedValue(req.body.approve === 'true');
      Letter.model.findOneAndUpdate({
         id: parseInt(req.body.id), 
         approvalStatus: Letter.approvedValues.inReview
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

            User.findOneAndUpdate({ _id: req.session.userId }, { $inc: { lettersCount: 1 } }, function(err, doc, res) {
               if(err) {
                  console.log(err);
               }
            });
         } else {
            var err = new Error('Could not change approval status of doc. Either because it is not in review or it does not exist.');
            err.status = 400;
            next(err);
         }
      });
      
   } else {
      var err = new Error('id, approve and flag are required for approving');
      err.status = 400;
      return next(err);
   }
});

function resolveInReviewStates(callback) {
   const fiveMinInMs = 1000 * 60 * 5;
   const fiveMinAgo = new Date(Date.now() - fiveMinInMs);
   Letter.model.find({ approvalStatus: Letter.approvedValues.inReview, inReviewSinceDate: { $lte: fiveMinAgo } }, function(err, results) {
      if(err) {
         callback(err); 
      } else if(!results || results.length === 0) {
         callback();
      } else {
         var resultCount = 0;
         results.map((result) => {
            Letter.model.updateOne({ _id: result._id }, { approvalStatus: Letter.approvedValues.queued }, function(err, raw) {
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