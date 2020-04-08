const User = require('../models/user');

module.exports = function requiresAdmin(req, res, next) {
    User.findById(req.session.userId).exec(function(error, user) {
        if(error) {
            res.redirect('/');
        } else {
            if(user.isAdmin) {
                return next();
            } else {
                res.redirect('/');
            }
        }
    });
}