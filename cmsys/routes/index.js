const express = require('express');
const router = express.Router();
const Course = require('../models/course');

router.get('/', async(req, res) => {
    let courses;
    try {
        courses = await Course.find().sort({ createdAt: 'desc' }).populate({
            path: 'group'
        }).limit(6).exec();
    } catch {
        courses = [];
    }
    res.render('index', { courses: courses });
});

module.exports = router;