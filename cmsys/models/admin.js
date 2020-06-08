const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const passportLocalMongoose = require('passport-local-mongoose');
adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Admin', adminSchema, 'Admin');