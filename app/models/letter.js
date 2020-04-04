var mongoose = require('mongoose');

var typeValues = {
    male: 'H',
    female: 'F'
}

var approvedValues = {
    queued: 'Queued',
    inReview: 'In Review',
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
        enum: [typeValues.male, typeValues.female],
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
        enum: [approvedValues.queued, approvedValues.inReview, approvedValues.accepted, approvedValues.rejected],
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

LetterSchema.virtual('composedId').get(function() {
    return `${this.type}${this.id}`;
});

module.exports = mongoose.model('Letter', LetterSchema);