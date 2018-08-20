const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Golfer, Course, Round} = require('./models');

const app = express();

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