const express = require('express');
const router = express.Router();

const loginReq = require('../../middleware/loginReq');
const adminReq = require('../../middleware/adminReq');

const User = require('../../models/user');

router.get('/list', loginReq, adminReq, function(req, res, next) {
    User.find().lean().exec(function(err, users) {
        if(err) {
            var error = new Error('Could not get batches list.');
            error.status = 500;
            next(error);
        } else {
            const cleanedUsers = users.map((user) => {
                return {
                    username: user.username,
                    isAdmin: user.isAdmin,
                    lettersCount: user.lettersCount
                }
            })
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(cleanedUsers));
        }
    });
});

router.post('/remove', loginReq, adminReq, function(req, res, next) {
    if(req.body.username) {
        User.remove({ username: req.body.username }, function(err) {
            if(err) {
                var err = new Error('Could not delete user. The request may be malformed.');
                err.status = 500;
                return next(err);
            } else {
                res.sendStatus(200);
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
        isAdmin: req.body.admin,
        lettersCount: 0
      }
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err);
        } else {
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