const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: { type:String, unique:true, required:true },
    password: { type:String, required:true }
});

module.exports = mongoose.model('users', UserSchema);