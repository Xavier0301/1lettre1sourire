
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var loginReq = require('../middleware/loginReq');

var Letter = require('../models/letter');
var User = require('../models/user');

router.get('/', loginReq, function(req, res) {
   res.send("Review page");
});

router.get('/fetch', loginReq, function(req, res) {
   Letter.findOne().exec(function(error, letter) {
   if(error) {
      res.send({exists: false});
   } else {
      res.send({id: letter.id, type: letter.type, greeting: letter.heading, content: letter.content, signature: letter.signature, imageUrl: letter.imageUrl, exists: true});
   }
   });
});

router.get('/approve', loginReq, function(req, res, next) {
   if(req.body.id && req.body.approve && req.body.flag) {
      var approved = Letter.getApprovedValue(req.body.approve);
      Letter.update({id: req.body.id}, {
         approvalStatus: approve,
         flagged: req.body.flag
      }, function(err, affected, resp) {
         console.log(resp);
      });
   } else {
      var err = new Error('id, approve and flag are required for approving');
      return next(err);
   }
});

module.exports = router;