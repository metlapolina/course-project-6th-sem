const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Trainer = require('../models/trainer');
const CourseGroup = require('../models/courseGroup');
const connectEnsureLogin = require('connect-ensure-login');

// All Courses Route
router.get('/', async(req, res) => {
    let query = Course.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    try {
        const courses = await query.populate('group').exec();
        res.render('courses/index', {
            courses: courses,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
});

// All Courses For Admin Route
router.get('/admin', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    try {
        res.render('courses/admin');
    } catch {
        res.redirect('/');
    }
});

// All Courses For Admin Route
router.get('/admin/api', async(req, res) => {
    try {
        const courses = await Course.find().populate('group').exec();
        const trainers = await Trainer.find().populate('user').exec();
        const groups = await CourseGroup.find();
        res.send({
            courses: courses,
            trainers: trainers,
            groups: groups
        });
    } catch {
        res.status(400);
    }
});

// Create Course Route
router.post('/', async(req, res) => {
    if (!req.body) res.status(400);
    try {
        const trainer = await Trainer.findById(req.body.trainerId);
        const group = await CourseGroup.findById(req.body.groupId);
        const course = new Course({
            title: req.body.title,
            trainer: trainer,
            group: group,
            info: req.body.info,
            type: req.body.type
        });

        await course.save();
        res.send(course);
    } catch {
        res.status(400);
    }
});

// Show Course Route
router.get('/:id', async(req, res) => {
    try {
        var course = await (await Course.findById(req.params.id).populate('trainer'))
            .populate('trainer.user')
            .populate('group')
            .execPopulate();
        const io = req.io;
        io.on('connection', socket => {
            socket.on('liked', async(count) => {
                try {
                    course.likeCount = Number.parseInt(count);
                    await course.save();
                    socket.broadcast.emit('like-course', count);
                } catch (err) {
                    console.log(err);
                }
            });
        })

        res.render('courses/show', { course: course });
    } catch {
        res.redirect('/');
    }
});

// Show Trainer Route
router.get('/api/:id', async(req, res) => {
    try {
        var course = await (await Course.findById(req.params.id).populate('trainer'))
            .populate('trainer.user')
            .populate('group')
            .execPopulate();
        res.send(course);
    } catch {
        res.status(400);
    }
});

// Edit Course Route
router.get('/:id/edit', async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.send(course);
    } catch {
        res.status(400);
    }
});

// Update Course Route
router.put('/:id', async(req, res) => {
    if (!req.body) res.status(400);
    try {
        const trainer = await Trainer.findById(req.body.trainerId);
        const group = await CourseGroup.findById(req.body.groupId);
        let course = await Course.findById(req.params.id);
        course.title = req.body.title;
        course.trainer = trainer;
        course.group = group;
        course.info = req.body.info;
        course.type = req.body.type;
        await course.save();
        res.send(course);
    } catch {
        res.status(400);
    }
});

// Delete Course Route
router.delete('/:id', async(req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id, (err, course) => {
            if (err) return console.log(err);
            res.send(course);
        });
    } catch {
        res.status(400);
    }
});

module.exports = router;