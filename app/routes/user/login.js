var express = require('express');
var router = express.Router();

var User = require('../../models/user');

router.post('/', function(req, res, next) {
  console.log(req.body);
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error) {
        res.status(401);
        return res.end('Wrong username or password.');
      } else {
        console.log(user);
        req.session.userId = user._id;
        if(user.isAdmin === false) {
          return res.redirect('/review');
        } else {
          return res.redirect('/admin');
        }
      }
    });
  } else {
    res.status(401);
    return res.end('Wrong username or password.');
  }
});

module.exports = router;