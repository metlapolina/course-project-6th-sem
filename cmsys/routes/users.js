const express = require('express');
const router = express.Router();
const User = require('../models/user');
const connectEnsureLogin = require('connect-ensure-login');

// All Users Route
router.get('/', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    try {
        res.render('users/index');
    } catch {
        res.redirect('/');
    }
});

// All Users Route
router.get('/api', async(req, res) => {
    try {
        const users = await User.find();
        var photos = [];
        users.forEach(user => {
            photos.push(user.photoImagePath);
        })
        res.send({
            users: users,
            photos: photos
        });
    } catch {
        res.send(400);
    }
});

module.exports = router;