var User = require('../models/user');

module.exports = function requiresAdmin(req, res, next) {
    User.findById(req.session.userId).exec(function(error, user) {
        if(error) {
            return next(error);
        } else {
            if(user.isAdmin) {
                return next();
            } else {
                var err = Error("You must be admin to view this page.");
                return next(err);
            }
        }
    });
}