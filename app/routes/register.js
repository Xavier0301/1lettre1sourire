var express = require('express');
var router = express.Router();

var loginReq = require('../middleware/loginReq');
var adminReq = require('../middleware/adminReq');

var User = require('../models/user');

router.post('/'/*, loginReq, adminReq*/, function(req, res) {
    if (req.body.password !== req.body.passwordConf) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
    }

    if (req.body.username &&
      req.body.password &&
      req.body.passwordConf) {
      var userData = {
        username: req.body.username,
        password: req.body.password,
        isAdmin: false
      }
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.end('User created');
        }
      });
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
});

module.exports = router;