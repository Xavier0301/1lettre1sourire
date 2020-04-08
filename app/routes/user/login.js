const express = require('express');
const router = express.Router();

const User = require('../../models/user');

const bcrypt = require('bcryptjs');

router.post('/', function(req, res, next) {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error) {
        const err = new Error("Wrong username or password");
        err.status = 401;
        next(err);
      } else {
        req.session.userId = user._id;
        if(user.isAdmin === false) {
          return res.redirect('/review');
        } else {
          return res.redirect('/admin');
        }
      }
    });
  } else {
    const err = new Error("Both a username and a password should be provided");
    err.status = 401;
    next(err);
  }
});

module.exports = router;