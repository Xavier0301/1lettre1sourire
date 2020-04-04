var mongoose = require('mongoose');

var approvedValues = {
    queued: 'Queued',
    accepted: 'Accepted',
    rejected: 'Rejected'
};

var LetterSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    submissionTime: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    content: {
       type : String,
       required: true
    },
    signature: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    approvalStatus: {
        type: String,
        enum: [approvedValues.queued, approvedValues.accepted, approvedValues.rejected],
        default: approvedValues.queued,
        required: true
    },
    flagged: {
        type: Boolean,
        default: false,
        required: true
    }
});

LetterSchema.statics.getApprovedValue = function(isApproved) {
    return isApproved ? approvedValues.accepted : approvedValues.rejected;
}

module.exports = mongoose.model('Letter', LetterSchema);