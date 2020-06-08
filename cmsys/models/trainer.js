const mongoose = require('mongoose');

const trainerShema = new mongoose.Schema({
    info: {
        type: String,
        maxlength: 2000
    },
    department: {
        type: String,
        maxlength: 128,
    },
    position: {
        type: String,
        maxlength: 128,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Trainer', trainerShema);