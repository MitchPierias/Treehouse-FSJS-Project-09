const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CourseSchema = new Schema({
    user: { type:ObjectId, ref:'users' },
    title: { type:String, required:true },
    description: { type:String, required:true },
    estimatedTime: { type:String, default:'0' },
    materialsNeeded: { type:String, default:'' }
});

module.exports = mongoose.model('courses', CourseSchema);