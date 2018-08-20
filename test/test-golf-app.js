'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');
const {PORT, DATABASE_URL, TEST_GOLFERID} = require('../config');

chai.use(chaiHttp);

describe('myGolfStats API', function() {
    before(function() {
        return runServer(DATABASE_URL);
    });
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
        return chai.request(app).get('/rounds/'+TEST_GOLFERID).then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.rounds.length).to.be.above(0);
            res.body.rounds.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.have.all.keys('roundId', 'golferId', 'courseId', 'courseLength', 'courseLocation', 'courseName', 'coursePars', 'courseRating', 'courseSlope', 'golferName', 'roundDate', 'roundScores', 'totalCoursePar', 'totalRoundScore', 'username');
            });
        });
    });

    
});