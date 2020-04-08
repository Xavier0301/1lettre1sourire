const apiConf = require('../../config/api');

function verifyKey(givenKey) {
    if(givenKey) {
        return givenKey === apiConf.key;
    }
    return false;
}

module.exports = function requiresAdmin(req, res, next) {
    if(verifyKey(req.body.apiKey) || verifyKey(req.query.apiKey)) {
        next();
    } else {
        const err = new Error("A correct apiKey is required.");
        err.status = 401;
        next(err);
    }
}