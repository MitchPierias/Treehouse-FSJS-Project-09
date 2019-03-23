const express = require('express');
const UserRoute = express.Router();
const Joi = require('joi');
const UserModel = require('./../models/user');
const { isAuthenticated, hashPassword } = require('./auth');

/**
 * Validators
 */
const IS_VALID_FIRST_NAME = Joi.string().required().min(1).label("firstName");
const IS_VALID_LAST_NAME = Joi.string().required().min(1).label("lastName");
const IS_VALID_EMAIL = Joi.string().required().min(1).label("email");
const IS_VALID_PASSWORD = Joi.string().required().min(1).label("password");

UserRoute.get('/', isAuthenticated, (req, res, next) => {
    res.json(req.user);
});

UserRoute.post('/', (req, res, next) => {
    // Arguments and validate arguments
    const { firstName, lastName, emailAddress, password } = req.body;
    Joi.assert(firstName, IS_VALID_FIRST_NAME);
    Joi.assert(lastName, IS_VALID_LAST_NAME);
    Joi.assert(emailAddress, IS_VALID_EMAIL);
    Joi.assert(password, IS_VALID_PASSWORD);
    // Create a new user
    const user = new UserModel({
        firstName,
        lastName,
        emailAddress,
        password:hashPassword(password)
    })
    // Save the new user
    user.save((err, result) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000)
                next({ status:400, message:"Email already registered" });
            else
                next(err);
        } else {
            res.location("/").send();
        }
    });
});

module.exports = UserRoute;