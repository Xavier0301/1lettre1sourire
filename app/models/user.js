const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    lettersCount: {
        type: Number,
        required: true,
        default: 0
    }
});

UserSchema.statics.authenticate = function (username, password, callback) {
    this.findOne({ username: username })
        .exec(function (err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                const err = new Error('Not the right password.');
                err.status = 401;
                return callback(err);
            }
        })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
});

module.exports = mongoose.model('User', UserSchema);