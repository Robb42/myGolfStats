'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');
const {PORT, TEST_DATABASE_URL, TEST_GOLFERID, TEST_COURSEID} = require('../config');
const {Golfer, Course, Round} = require('../models');

chai.use(chaiHttp);

function seedRoundData() {
    console.info('seeding round data');
    const seedData = [];
    for (let i = 1; i <=10; i++) {
        seedData.push(generateRoundData());
    }
    return Round.insertMany(seedData);
}

function generateHoles() {
    return Array.from({length: 18}, () => Math.floor(Math.random() * (10 - 2) + 2));
}

function generateRoundData() {
    return {
        golferInfo: TEST_GOLFERID,
        holeScores: generateHoles(),
        courseInfo: TEST_COURSEID,
        roundDate: faker.date.past()
    }
}

function generateGolferData() {
    return {
        _id: TEST_GOLFERID,
        firstName: faker.name.firstName,
        lastName: faker.name.lastName,
        userName: faker.internet.userName,
        password: faker.random.last_name
    }
}

function generateCourseData() {
    return {
        _id: TEST_COURSEID,
        courseName: `${faker.random.last_name} Country Club`,
        courseCity: faker.address.city,
        courseState: faker.address.usState,
        nineOrEighteen: "18",
        courseRating: "67.8",
        courseSlope: "124",
        coursePars: generateHoles()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


describe('myGolfStats API', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function () {
        return seedRoundData();
    })
    afterEach(function () {
        return tearDownDb();
    })
    after(function() {
        return closeServer();
    });

    it('should return status 200 and HTML on GET to root', function() {
        return chai.request(app).get('/').then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });

    it('should return status 200 and HTML on GET to root/login.html', function() {
        return chai.request(app).get('/login.html').then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });

    it('should list all rounds on GET to /rounds/:golferId', function() {
        let res;
        let resRound;
        return chai.request(app).get('/rounds/'+TEST_GOLFERID).then(function(_res) {
            res = _res;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.rounds.length).to.be.above(0);
            res.body.rounds.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.have.all.keys('roundId', 'golferId', 'courseId', 'courseLength', 'courseLocation', 'courseName', 'coursePars', 'courseRating', 'courseSlope', 'golferName', 'roundDate', 'roundScores', 'totalCoursePar', 'totalRoundScore', 'username');
            });
            return Round.count();
        }).then(function(count) {
            expect(res.body.rounds).to.have.lengthOf(count);
            resRound = res.body.rounds[0];
            return Round.findById(resRound.id);
        }).then(function(round) {
            expect(resRound.id).to.equal(round.id);
            expect(resRound.golferInfo).to.equal(round.golferInfo);
            expect(resRound.courseInfo).to.equal(round.courseInfo);
            expect(resRound.roundDate).to.equal(round.roundDate);
        });
    });

    it('should add a round on POST to /rounds/:golferId', function() {
        const newItem = generateRoundData();
        return chai.request(app).post('/rounds/5b79872d19b3f42c6651094c').send(newItem).then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('golferInfo', 'courseInfo', 'roundDate', 'holeScores');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
        });
    });

    it('should add a golfer on POST to /golfers', function () {
        const newItem = generateGolferData();
        return chai.request(app).post('/golfers').send(newItem).then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('firstName', 'lastName', 'userName', 'password');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
        });
    });

    it('should add a course on POST to /courses', function () {
        const newItem = generateCourseData();
        return chai.request(app).post('/courses').send(newItem).then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('courseName', 'courseCity', 'courseState', 'nineOrEighteen', 'courseRating', 'courseSlope', 'coursePars');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
        });
    });
    
});