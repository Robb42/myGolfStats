'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('myGolfStats API', function() {
    before(function() {
        return runServer();
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
});