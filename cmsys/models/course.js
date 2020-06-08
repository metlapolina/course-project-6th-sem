const mongoose = require('mongoose');

const courseShema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 64,
        required: true
    },
    info: {
        type: String,
        maxlength: 2000
    },
    type: {
        type: String,
        enum: ['Practice', 'Lectures'],
        required: true
    },
    likeCount: {
        type: Number
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Trainer'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'CourseGroup'
    }
})

module.exports = mongoose.model('Course', courseShema);