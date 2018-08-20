'use strict';

const mongoose = require('mongoose');

const golferSchema = mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    userName: {type: 'string', unique: true},
    password: {type: 'string', required: true}
});

const courseSchema = mongoose.Schema({
    courseName: 'string',
    courseCity: 'string',
    courseState: 'string',
    nineOrEighteen: 'string',
    courseRating: 'string', 
    courseSlope: 'string',
    coursePars: 'array'
});

const roundSchema = mongoose.Schema({
    golferInfo: {type: mongoose.Schema.Types.ObjectId, ref: 'Golfer'},
    courseInfo: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    roundDate: 'string',
    holeScores: 'array'
});

roundSchema.pre('find', function(next) {
    this.populate('golferInfo');
    this.populate('courseInfo');
    next();
});

roundSchema.virtual('golferFullName').get(function () {
    return `${this.golferInfo.firstName} ${this.golferInfo.lastName}`;
});

roundSchema.virtual('courseLocation').get(function() {
    return `${this.courseInfo.courseCity}, ${this.courseInfo.courseState}`;
});

roundSchema.methods.serialize = function() {
    return {
        roundId: this._id,
        roundDate: this.roundDate,
        golferName: this.golferFullName,
        golferId: this.golferInfo._id,
        username: this.golferInfo.userName,
        courseName: this.courseInfo.courseName,
        courseId: this.courseInfo._id,
        courseLocation: this.courseLocation,
        courseLength: this.courseInfo.nineOrEighteen,
        courseRating: this.courseInfo.courseRating,
        courseSlope: this.courseInfo.courseSlope,
        coursePars: this.courseInfo.coursePars,
        totalCoursePar: this.courseInfo.coursePars.reduce((a,b) => a+b, 0),
        roundScores: this.holeScores,
        totalRoundScore: this.holeScores.reduce((a,b) => a+b, 0)
    }
}

const Golfer = mongoose.model('Golfer', golferSchema);
const Course = mongoose.model('Course', courseSchema);
const Round = mongoose.model('Round', roundSchema);

module.exports = {Golfer, Course, Round};