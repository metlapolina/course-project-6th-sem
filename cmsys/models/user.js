const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 128,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 128,
        required: true
    },
    email: {
        type: String,
        maxlength: 128,
        required: true
    },
    photoImage: {
        type: Buffer
    },
    photoImageType: {
        type: String
    }
});

userSchema.virtual('photoImagePath').get(function() {
    if (this.photoImage != null && this.photoImageType != null) {
        return `data:${this.photoImageType};charset=utf-8;base64,${this.photoImage.toString('base64')}`;
    }
});

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);