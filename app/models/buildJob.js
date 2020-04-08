const mongoose = require('mongoose');

const BuildJobSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    }
});

BuildJobSchema.statics.hasOne = function(callback) {
    return this.countDocuments({}, function(err, count) {
        console.log("count of docs: " + count);
        if(count && count !== null) {
            callback(count !== 0);
        } else {
            callback(false);
        }
    });
}

module.exports = mongoose.model('BuildJob', BuildJobSchema);