const mongoose = require('mongoose');
const typeValues = require('./letter').typeValues;

const BatchSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [typeValues.male, typeValues.female],
        required: true
    },
    index: {
        type: Number,
        required: true
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
            callback(batch.letterCount);
        } else {
            callback(0);
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

BatchSchema.virtual('composedId').get(function() {
    return `${this.type}${this.index}`;
});

BatchSchema.virtual('associatedFileName').get(function() {
    return `${this.type}${this.index}.pdf`;
});

module.exports = mongoose.model('Batch', BatchSchema);