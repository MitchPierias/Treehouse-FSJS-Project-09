const bcrypt = require('bcryptjs');
const UserModel = require('./../models/user');

exports.hashPassword = password => {
    // Hash input password
    return bcrypt.hashSync(password, 10);
}

exports.visitorDetails = (req, res, next) => {
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [ login, password ] = Buffer.from(b64auth, 'base64').toString().split(':');

    UserModel.findOne({ emailAddress:login }).then(user => {
        req.user = user;
        next();
    }).catch(error => {
        next({ error });
    });
}

exports.isAuthenticated = (req, res, next) => {
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [ login, password ] = Buffer.from(b64auth, 'base64').toString().split(':');
    const user = req.user;
    
    if (user && bcrypt.compareSync(password, user.password)) {
        next();
    } else {
        next({ status:401, message:"Username or Password incorrect" });
    }
}