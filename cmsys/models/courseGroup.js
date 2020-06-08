const mongoose = require('mongoose');

const courseGroupShema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 64,
        required: true
    },
    coverImage: {
        type: Buffer
    },
    coverImageType: {
        type: String
    }
})

courseGroupShema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
    }
});

module.exports = mongoose.model('CourseGroup', courseGroupShema);