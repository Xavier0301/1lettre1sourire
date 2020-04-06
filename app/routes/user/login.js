var express = require('express');
var router = express.Router();

var User = require('../../models/user');

router.post('/', function(req, res, next) {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error) {
        res.status(401);
        return res.end('Wrong username or password.');
      } else {
        req.session.userId = user._id;
        if(req.header('X-Requested-With') == 'XMLHttpRequest')  {
          res.status(200);
          res.end('Login Success');
        } else {
          if(user.isAdmin === false) {
            return res.redirect('/review');
          } else {
            return res.redirect('/admin');
          }
        }
      }
    });
  } else {
    res.status(401);
    return res.end('Wrong username or password.');
  }
});

module.exports = router;