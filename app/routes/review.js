const express = require('express');
const router = express.Router();
const logger = require('log4js').getLogger('runtime');

const Queue = require('bull');
const docbuildProcessor = require('../afterware/docbuilder');
const docbuildQueue = new Queue('doc building');
docbuildQueue.process(docbuildProcessor);

const loginReq = require('../middleware/loginReq');

const BuildJob = require('../models/buildJob');
const Letter = require('../models/letter');
const User = require('../models/user');

router.get('/', loginReq, function(req, res) {
   res.sendFile('review.html', { root: './src' });
});

router.get('/fetch', loginReq, function(req, res) {

   const errSend = (caughtErr) => {
      logger.error(caughtErr);
      return res.send({exists: false});
   };
   // FIND ONE THAT IS HAS APPROVAL STATUS: 'QUEUED'
   resolveInReviewStates(function(err) {
      if(err) {
         errSend(err);
      } else {
         Letter.model.findOneAndUpdate({ approvalStatus: Letter.approvedValues.queued }, {
            approvalStatus: Letter.approvedValues.inReview, 
            inReviewSinceDate: Date.now()}).exec(function(error, letter) {
            if(error || !letter) {
               errSend(error);
            } else {
               res.send({id: letter.id, type: letter.type, greeting: letter.heading, content: letter.content, signature: letter.signature, imageUrl: letter.imageUrl, exists: true});
            }
         });
      } 
   })
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

router.post('/approve', loginReq, function(req, res, next) {
   if(req.body.id && req.body.approve !== undefined && req.body.flag !== undefined) {
      const approved = Letter.getApprovedValue(req.body.approve);
      Letter.model.findOneAndUpdate({
         id: parseInt(req.body.id), 
         approvalStatus: Letter.approvedValues.inReview
      }, {
         approvalStatus: approved,
         flagged: req.body.flag,
         $unset: {
            inReviewSinceDate: ""
         },
         approvedByUser: req.session.userId
      }, function(err, letter) {
         if(letter && !err) {
            res.sendStatus(200);

            if(req.body.approve) {
               console.log('/approve approve is true start doc build');
               docbuildQueue.add({ letter: letter }, { 
                  delay: 30*1000, 
                  attempts: 5, 
                  jobId: letter.id,
                  removeOnComplete: true,
                  removeOnFail: true
               });
            }

            User.findOneAndUpdate({ _id: req.session.userId }, { $inc: { letterCount: 1 } }, function(err, doc, res) {
               if(err) {
                  logger.error(err);
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

router.post('/undo', loginReq, function(req, res, next) {
   if(req.body.lastId) {
      const lastId = parseInt(req.body.lastId);

      // req.body.currentId is not defined ONLY WHEN the user
      //    - just rated a letter
      //    - fetched the next one from server. 
      //    - server said "Sorry no letter left"
      //    - frontend then sets currentId = undefined
      //    - user decided to undo.
      if(req.body.currentId) {
         const currentId = parseInt(req.body.currentId);
         Letter.model.updateOne({ 
            id: currentId, 
            approvalStatus: Letter.approvedValues.inReview 
         }, { 
            approvalStatus: Letter.approvedValues.queued, 
            $unset: {
               inReviewSinceDate: ""
            }
         }, function(err, result) {
            if(err) {
               logger.error(err);
            }
         });
      } 

      docbuildQueue.getJob(lastId)
         .then(function(job) {
            job.isDelayed()
               .then(function(inDelayedState) {
                  if(inDelayedState) {
                     return job.remove();
                  } else {
                     const error = new Error('Could not undo.');
                     error.status = 400;
                     throw error;
                  }
               })
               .then(function() {
                  console.log('fine');

                  Letter.model.findOneAndUpdate({ id: lastId }, { 
                     approvalStatus: Letter.approvedValues.inReview, 
                     flagged: false, 
                     inReviewSinceDate: Date.now(),
                     $unset: {
                        approvedByUser: ""
                     }
                  }, function(err, letter) {
                     if(err) {
                        logger.log(err);
                        err.status = 400;
                        next(err);
                     } else {
                        res.send({id: letter.id, type: letter.type, greeting: letter.heading, content: letter.content, signature: letter.signature, imageUrl: letter.imageUrl, exists: true});
                     }
                  })
               })
               .catch(function(reason) {
                  if(reason instanceof Error) {
                     next(reason);
                  } else {
                     let err = new Error('Could not get job');
                     err.status = 500;
                     return next(err);
                  }
               });
         })
         .catch(function(reason) {
            Letter.model.findOneAndUpdate({ 
               id: lastId, 
               approvalStatus: Letter.approvedValues.rejected
            }, { 
               approvalStatus: Letter.approvedValues.inReview, 
               flagged: false, 
               inReviewSinceDate: Date.now(),
               $unset: {
                  approvedByUser: ""
               }
            }, function(err, letter) {
               if(err) {
                  const err = new Error('Either cannot undo or cannot find the letter.');
                  err.status = 400;
                  next(err);
               } else {
                  res.send({id: letter.id, type: letter.type, greeting: letter.heading, content: letter.content, signature: letter.signature, imageUrl: letter.imageUrl, exists: true});
               }
            })
         });
   } else {
      const err = new Error('You must provide the id of the letter you want to undo, as well as the id of the one you are currently reviewing');
      err.status = 400;
      return next(err);
   }
});

// function processBuildDocRequest(letter) {
//    BuildJob.hasOne(function(hasOne) {
//       if(hasOne) {
//          console.log("has one: timeouts");
//          setTimeout(processBuildDocRequest, 2000, letter);
//       } else {
//          console.log("has none: go build");
//          let buildJob = new BuildJob();
//          buildJob.id = letter.composedId;
//          buildJob.save(function(err) {
//             if(err) {
//                logger.error(err);
//             } else {
//                docBuilder(letter, function() {
//                   BuildJob.remove({ id: buildJob.id }, function(err) {
//                      logger.error(err);
//                   })
//                });
//             }
//          });
//       }
//    });
// }

module.exports = router;