var mongoose = require('mongoose');

var typeValues = {
    male: 'H',
    female: 'F'
}

var BatchSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [typeValues.male, typeValues.female],
        required: true
    },
    index: {
        type: Number,
        required: true,
        unique: true
    },
    letterCount: {
        type: Number,
        required: true
    },
    downloaded: {
        type: Boolean,
        required: true
    }
});

BatchSchema.statics.numberOfLettersInBatch = function(batchIndex, type, callback) {
    return this.findOne({ index: batchIndex, type: type }, function(error, batch) {
        if(batch) {
            return callback(batch.lettersCount);
        } else {
            return callback(0);
        }
    });
}

BatchSchema.statics.currentBatchIndex = function(type, callback) {
    return this.countDocuments({type: type}, function(err, count) {
        if(count) {
            callback(count);
        } else {
            callback(0);
        }
    });
}

module.exports = mongoose.model('Batch', BatchSchema);