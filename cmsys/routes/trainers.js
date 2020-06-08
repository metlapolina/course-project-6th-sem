const express = require('express');
const router = express.Router();
const Trainer = require('../models/trainer');
const User = require('../models/user');
const Course = require('../models/course');
const connectEnsureLogin = require('connect-ensure-login');

// All Trainers Route
router.get('/', async(req, res) => {
    try {
        res.render('trainers/index');
    } catch {
        res.redirect('/');
    }
});

// All Trainers For Admin Route
router.get('/admin', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    try {
        res.render('trainers/admin');
    } catch {
        res.redirect('/');
    }
});

// All Trainers For Admin Route
router.get('/admin/api', async(req, res) => {
    try {
        const trainers = await Trainer.find().populate('user').exec();
        const users = await User.find();
        var photos = [];
        trainers.forEach(trainer => {
            photos.push(trainer.user.photoImagePath);
        })
        res.send({
            trainers: trainers,
            users: users,
            photos: photos
        });
    } catch {
        res.status(400);
    }
});

// Create Trainer Route
router.post('/', async(req, res) => {
    if (!req.body) res.status(400);
    try {
        const user = await User.findById(req.body.userId);
        const trainer = new Trainer({
            info: req.body.info,
            user: user,
            department: req.body.department,
            position: req.body.position
        });

        await trainer.save();
        res.send(trainer);
    } catch {
        res.status(400);
    }
});

// Show Trainer Route
router.get('/:id', async(req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id).populate('user').exec();
        const courses = await Course.find({ trainer: trainer.id }).exec();
        res.send({ trainer: trainer, photo: trainer.user.photoImagePath, courses: courses });
    } catch {
        res.status(400);
    }
});

// Edit Trainer Route
router.get('/:id/edit', async(req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id).populate('user').exec();
        res.send(trainer);
    } catch {
        res.status(400);
    }
});

// Update Trainer Route
router.put('/:id', async(req, res) => {
    if (!req.body) res.status(400);
    try {
        let user = await User.findById(req.body.userId);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        await user.save();
        let trainer = await Trainer.findById(req.body.id);
        trainer.info = req.body.info;
        trainer.user = user;
        trainer.department = req.body.department;
        trainer.position = req.body.position;
        await trainer.save();
        res.send(trainer);
    } catch {
        res.status(400);
    }
});

// Delete Trainer Route
router.delete('/:id', async(req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id, async(err, trainer) => {
            if (err) return console.log(err);
            let courses = await Course.find({ trainer: req.params.id });
            courses.forEach(async course => await course.remove());
            res.send(trainer);
        });
    } catch {
        res.status(400);
    }
});

module.exports = router;