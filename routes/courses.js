const express = require('express');
const CourseRoute = express.Router();
const Joi = require('joi');
const path = require('path');
const CourseModel = require('./../models/course');
const { isAuthenticated } = require('./auth');

/**
 * Validators
 */
const IS_VALID_TITLE = Joi.string().required().min(1).label("title");
const IS_VALID_DESCRIPTION = Joi.string().required().min(1).label("description");

/**
 * Course validator
 * @desc Validates the required course arguments are provided
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware stepper
 */
const whenValidCourse = (req, res, next) => {
    // Extract and validate arguments
    const { title, description } = req.body;
    Joi.assert(title, IS_VALID_TITLE);
    Joi.assert(description, IS_VALID_DESCRIPTION);
    next();
}

/**
 * Filter Courses
 * @desc Removes `emailAddress` and `password` properties from course `user`
 * @param {Array<Object>} courses Collection of course objects
 */
const filterCourses = (courses=[]) => {
    return courses.map(filterCourseUser);
}

const filterCourseUser = (course={}) => {
    // Delete property doesn't seem to be working here...
    course.user.emailAddress = undefined;
    course.user.password = undefined;
    return course;
}

/**
 * All Courses
 * @desc Get all courses and their owners
 */
CourseRoute.get('/', (req, res, next) => {
    // Find all courses and user
    CourseModel.find().populate('user').then(filterCourses).then(allCourses => {
        res.json(allCourses);
    }).catch(err => {
        next(err);
    });
});

/**
 * Get Course
 * @desc Retreives the course and user with the specified id
 */
CourseRoute.get('/:id', (req, res, next) => {
    // Find the course and user with the specified ID
    CourseModel.findOne({ _id:req.params.id }).populate('user').then(filterCourseUser).then(allCourses => {
        res.json({ courses:allCourses });
    }).catch(err => {
        next({ status:404, message:`Course '${req.params.id}' not found` });
    });
});

/**
 * Create Course
 * @desc Creates a new course for the currently logged user
 * @note Doesn't insure uniqueness as it's not outlined in the spec
 */
CourseRoute.post('/', isAuthenticated, whenValidCourse, (req, res, next) => {
    // Extract arguments
    const user = req.user._id;
    const { title, description, estimatedTime, materialsNeeded } = req.body;
    // Define a new course
    const course = new CourseModel({
        user,
        title,
        description,
        estimatedTime,
        materialsNeeded
    });
    // Save the new course
    course.save((err, doc) => {
        if (err) return next(err);
        res.location(path.join(req.originalUrl, doc._id.toString())).send();
    });
});

/**
 * Update Course
 * @desc Updates the course with specified `_id` and properies
 */
CourseRoute.put('/:id', isAuthenticated, whenValidCourse, (req, res, next) => {
    // Search for the course for the current user
    CourseModel.findOne({ _id:req.params.id }).then(course => {
        if (!course) throw "Course doesn't exist";
        if (course.user.toString() !== req.user._id.toString()) throw "User doesn't manage course";
        return course;
    }).then(course => {
        // Update course document props
        for (let prop in course) {
            if (!req.body[prop] || prop === "_id") continue;
            course[prop] = req.body[prop];
        }
        // Save the course changes
        course.save(err => {
            if (err) return next(err);
            res.send();
        });
    }).catch(message => next({ status:400, message }));
});

/**
 * Delete Course
 * @desc Deletes the course with specified `_id` and returns nothing
 */
CourseRoute.delete('/:id', isAuthenticated, (req, res, next) => {
    // Search for the course for the current user
    CourseModel.findOne({ _id:req.params.id }).then(course => {
        if (!course) throw "Course doesn't exist";
        if (course.user.toString() !== req.user._id.toString()) throw "User doesn't manage course";
        return course;
    }).then(({ _id }) => {
        // Deletes the users course
        CourseModel.deleteOne({ _id }, err => {
            if (err) return next(err);
            res.send();
        });
    }).catch(message => next({ status:400, message }));
});

module.exports = CourseRoute;