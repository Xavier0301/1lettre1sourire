const mongoose = require('mongoose');

const expectedTypeValues = {
    male: 'Un monsieur âgé isolé',
    female: 'Une dame âgée isolée'
};

const typeValues = {
    male: 'H',
    female: 'F'
};

const approvedValues = {
    queued: 'Queued',
    inReview: 'In Review',
    accepted: 'Accepted',
    rejected: 'Rejected'
};

const LetterSchema = new mongoose.Schema({
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
    },
    batchIndex: {
        type: Number
    },
    inReviewSinceDate: {
        type: Date
    },
    approvedByUser: {
        type: mongoose.ObjectId
    }
});

LetterSchema.statics.getApprovedValue = function getApprovedValue(isApproved) {
    if(isApproved instanceof String) {
        return getApprovedValue(isApproved === "true");
    }
    return isApproved ? approvedValues.accepted : approvedValues.rejected;
}

LetterSchema.virtual('composedId').get(function() {
    return `${this.type}${this.id}`;
});

module.exports = {
    model: mongoose.model('Letter', LetterSchema),
    approvedValues: approvedValues,
    typeValues: typeValues,
    expectedTypeValues: expectedTypeValues,
    getApprovedValue: ((isApproved) => isApproved ? approvedValues.accepted : approvedValues.rejected)
};