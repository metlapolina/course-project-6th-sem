const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const CourseGroup = require('../models/courseGroup');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const connectEnsureLogin = require('connect-ensure-login');

// All Course Groups Route
router.get('/', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    try {
        res.render('courseGroups/index');
    } catch {
        res.redirect('/');
    }
});

// All Course Groups Route
router.get('/api', async(req, res) => {
    try {
        const courseGroups = await CourseGroup.find();
        res.send(courseGroups);
    } catch {
        res.status(400);
    }
});

// Create Course Group Route
router.post('/', async(req, res) => {
    if (!req.body) res.status(400);
    const courseGroup = new CourseGroup({
        title: req.body.title
    });
    saveCover(courseGroup, req.body.cover);

    try {
        await courseGroup.save();
        res.send(courseGroup);
    } catch {
        res.status(400);
    }
});

// Edit Course Group Route
router.get('/:id/edit', async(req, res) => {
    try {
        const courseGroup = await CourseGroup.findById(req.params.id);
        res.send({ group: courseGroup, cover: courseGroup.coverImagePath });
    } catch {
        res.status(400);
    }
});

// Update Course Group Route
router.put('/:id', async(req, res) => {
    if (!req.body) res.status(400);
    let courseGroup;
    try {
        courseGroup = await CourseGroup.findById(req.params.id);
        courseGroup.title = req.body.title;
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(courseGroup, req.body.cover);
        }
        await courseGroup.save();
        res.send(courseGroup);
    } catch {
        res.status(400);
    }
});

// Delete Course Group Route
router.delete('/:id', async(req, res) => {
    let courseGroup;
    try {
        await CourseGroup.findByIdAndDelete(req.params.id, async(err, group) => {
            if (err) return console.log(err);
            let courses = await Course.find({ group: req.params.id });
            courses.forEach(async course => await course.remove());

            res.send(group);
        });
    } catch {
        res.status(400);
    }
});

function saveCover(courseGroup, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        courseGroup.coverImage = new Buffer.from(cover.data, 'base64');
        courseGroup.coverImageType = cover.type;
    }
}

module.exports = router;