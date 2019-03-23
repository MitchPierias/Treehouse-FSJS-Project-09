const express= require('express');
const APIRoute = express.Router();
// Routes
const userRoute = require('./users');
const courseRoute = require('./courses');
const { visitorDetails } = require('./auth');

APIRoute.use(visitorDetails);

APIRoute.use('/users?', userRoute);

APIRoute.use('/courses?', courseRoute);

module.exports = APIRoute;