var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.post('/', function(req, res, next) {
    console.log(req.body);
    if (req.body.username && req.body.password) {
      User.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong username or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.send({ username: user.username, admin: user.isAdmin });
        }
      });
    } else {
      var err = new Error('Username and password are required.');
      err.status = 401;
      return next(err);
    }
  });

module.exports = router;