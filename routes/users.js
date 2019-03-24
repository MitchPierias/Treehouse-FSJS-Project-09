const express = require('express');
const UserRoute = express.Router();
const Joi = require('joi');
const UserModel = require('./../models/user');
const { isAuthenticated, hashPassword } = require('./auth');

/**
 * Validators
 */
const IS_VALID_USER = Joi.object().keys({
    firstName:Joi.string().required().min(1).label("firstName"),
    lastName:Joi.string().required().min(1).label("lastName"),
    emailAddress:Joi.string().required().min(1).label("email"),
    password:Joi.string().required().min(1).label("password")
})

UserRoute.get('/', isAuthenticated, (req, res, next) => {
    res.json(req.user);
});

UserRoute.post('/', (req, res, next) => {
    // Arguments and validate arguments
    const { firstName, lastName, emailAddress, password } = req.body;
    Joi.validate({ firstName, lastName, emailAddress, password }, IS_VALID_USER, (err, values) => {
        if (err && err.isJoi)
            return next({ status:400, message:err.details[0].message });
        // Create a new user
        const user = new UserModel({...values, password:hashPassword(values.password) })
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
});

module.exports = UserRoute;