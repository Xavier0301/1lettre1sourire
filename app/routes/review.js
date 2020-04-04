var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var loginReq = require('../middleware/loginReq');

var Letter = require('../models/letter');
var User = require('../models/user');

var docBuilder = require('../afterware/docbuilder');

router.get('/', loginReq, function(req, res) {
   res.send("Review page");
});

router.get('/fetch', loginReq, function(req, res) {
   // FIND ONE THAT IS HAS APPROVAL STATUS: 'QUEUED'
   // Letter.findOne({approvalStatus: 'QUEUED'})
   Letter.findOneAndUpdate({approvalStatus: 'Queued'}, {approvalStatus: 'In Review'}).exec(function(error, letter) {
      if(error || !letter) {
         res.send({exists: false});
      } else {
         res.send({id: letter.id, type: letter.type, greeting: letter.heading, content: letter.content, signature: letter.signature, imageUrl: letter.imageUrl, exists: true});
      }
   });
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
         flagged: req.body.flag === 'true'
      }, function(err, letter) {
         if(letter && !err) {
            res.send(200);
            docBuilder(letter);
         } else {
            res.send('Could not change approval status of doc. Either because it is not in review or it does not exist.');
         }
      });
      
   } else {
      var err = new Error('id, approve and flag are required for approving');
      return next(err);
   }
});

module.exports = router;