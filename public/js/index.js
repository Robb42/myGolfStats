'use strict'

function getGolferInfo(callbackFn) {
    setTimeout(function() {
        callbackFn(MOCK_GOLFERS)
    }, 100);
}

function getRecentRoundInfo(callbackFn) {
    setTimeout(function(){
        callbackFn(MOCK_ROUNDS)
    }, 100);
}

function getStatInfo(callbackFn) {
    let runningSum = 0;
    for (let i = 0; i < MOCK_ROUNDS.golfRounds.length; i++) {
        for (let j = 0; j < MOCK_ROUNDS.golfRounds[i].holeScores.length; j++) {
            runningSum = MOCK_ROUNDS.golfRounds[i].holeScores[j] + runningSum;
        }
    }    
    let overParAvg = (runningSum / MOCK_ROUNDS.golfRounds.length) - MOCK_COURSES.golfCourses[0].totalPar;
    displayStatInfo(overParAvg);
}

function displayGolferInfo(data) {
    $('#golfer-info').append(`
    ${data.golfers[0].golferName.firstName} ${data.golfers[0].golferName.lastName}
    <hr>
    `)
}

function displayRoundInfo(data) {
    data.golfRounds.forEach(function(element) {
        $('#round-info').append(`
            ${element.roundDate} | 
            ${element.courseId} |
            <br>
        `)
    });
}

function displayStatInfo(data) {
    $('#stat-info').append(`
        Current over par average: ${data}
        <hr>
    `)
}

function getAndDisplayInfo() {
    getGolferInfo(displayGolferInfo);
    getRecentRoundInfo(displayRoundInfo);
    getStatInfo(displayStatInfo);
}

$(getAndDisplayInfo);

const MOCK_ROUNDS = {
    "golfRounds": [
        {
            "roundId": "1111111111",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "8/12/2018",
            "holeScores": [6,6,5,7,6,6,6,5,7]
        },
        {
            "roundId": "1111111112",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "7/12/2018",
            "holeScores": [7,5,6,6,7,5,7,4,8]
        }
    ]
}

const MOCK_GOLFERS = {
    "golfers": [
        {
            "golferId": "aaaaaaaaaa",
            "golferName": {
                "firstName": "Mock",
                "lastName": "Golfer"
            },
            "userName": "mock.golfer"
        }
    ]
}

const MOCK_COURSES = {
    "golfCourses": [
        {
            "courseId": "111aaa111a",
            "courseName": "Hoodkroft Country Club",
            "courseLocation": "Derry, New Hampshire",
            "nineOrEighteen": "9",
            "totalPar": "36",
            "courseRating": "35.6",
            "courseSlope": "125",
            "coursePars": [4,4,3,5,4,4,4,3,5]
        }
    ]
}