var mongoose = require('mongoose');

// define our letters model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Letter', {
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
    }
});