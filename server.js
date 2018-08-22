const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Golfer, Course, Round} = require('./models');

const app = express();
const jsonParser = bodyParser.json();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());


app.get('/rounds/:golferId', (req, res) => {
    Round.find({"golferInfo": `${req.params.golferId}`}).exec((err, rounds) => {
        if (err) {
            res.status(500).json({message: 'Internal server error'});
        } else {
            res.json({
                rounds: rounds.map((round) => round.serialize())
            });
        }
    });
});

app.post('/rounds/:golferId', jsonParser, (req, res) => {
    const requiredFields = ['courseInfo', 'roundDate', 'holeScores'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Round.create({
        golferInfo: req.params.golferId,
        courseInfo: req.body.courseInfo,
        roundDate: req.body.roundDate,
        holeScores: req.body.holeScores
    });
    res.status(201).json({
        golferInfo: req.params.golferId,
        courseInfo: req.body.courseInfo,
        roundDate: req.body.roundDate,
        holeScores: req.body.holeScores
    });
});

app.post('/golfers', jsonParser, (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'userName', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Golfer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password
    });
    res.status(201).json({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password
    });
});

app.post('/courses', jsonParser, (req, res) => {
    const requiredFields = ['courseName', 'courseCity', 'courseState', 'nineOrEighteen', 'courseRating', 'courseSlope', 'coursePars'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Course.create({
        courseName: req.body.courseName,
        courseCity: req.body.courseCity,
        courseState: req.body.courseState,
        nineOrEighteen: req.body.nineOrEighteen,
        courseRating: req.body.courseRating,
        courseSlope: req.body.courseSlope,
        coursePars: req.body.coursePars
    });
    res.status(201).json({
        courseName: req.body.courseName,
        courseCity: req.body.courseCity,
        courseState: req.body.courseState,
        nineOrEighteen: req.body.nineOrEighteen,
        courseRating: req.body.courseRating,
        courseSlope: req.body.courseSlope,
        coursePars: req.body.coursePars
    });
});

app.delete('/rounds/:id', (req, res) => {
    Round.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).json({message: 'success'});
    }).catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went wrong'});
    });
});

app.put('/rounds/:id', jsonParser, (req, res) => {
    const field = 'holeScores';
    if(!(field in req.body)) {
        const message = `Missing ${field} in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating round id ${req.params.id}`);
    Round.update({
        $set: {holeScores: [req.body.holeScores[0], req.body.holeScores[1], req.body.holeScores[2], req.body.holeScores[3], req.body.holeScores[4],req.body.holeScores[5],req.body.holeScores[6],req.body.holeScores[7],req.body.holeScores[8]]}
    });
    res.status(204).end();
});

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
        });
        server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
        }).on('error', err => {
            mongoose.disconnect();
            reject(err);
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing Server");
            server.close(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};