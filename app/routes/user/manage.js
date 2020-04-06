var express = require('express');
var router = express.Router();

var loginReq = require('../../middleware/loginReq');
var adminReq = require('../../middleware/adminReq');

var User = require('../../models/user');

router.get('/list', loginReq, adminReq, function(req, res, next) {
    console.log("did someone ask us?");
    User.find().lean().exec(function(err, users) {
        if(err) {
            console.log(err);
            console.log('cannot list users');
            var error = new Error('Could not get batches list.');
            error.status = 500;
            next(error);
        } else {
            const cleanedUsers = users.map((user) => {
                return {
                    username: user.username,
                    isAdmin: user.isAdmin
                }
            })
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(cleanedUsers));
        }
    });
});

router.post('/remove', loginReq, adminReq, function(req, res, next) {
    console.log('removing??');
    if(req.body.username) {
        User.remove({ username: req.body.username }, function(err) {
            if(err) {
                console.log(err);
                console.log('cannot delete user');
                var err = new Error('Could not delete user. The request may be malformed.');
                err.status = 500;
                return next(err);
            } else {
                res.end("Deleted user");
            }
        });
    } else {
        var err = new Error('username field required to delete user.');
        err.status = 400;
        return next(err);
    }
});

router.post('/register'/*, loginReq, adminReq*/, function(req, res, next) {
    if (req.body.username && req.body.password && req.body.admin !== undefined) {
      var userData = {
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.admin
      }
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err);
        } else {
        //   req.session.userId = user._id;
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