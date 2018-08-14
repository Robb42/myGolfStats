'use strict'

function getGolfInfo(callbackFn) {
    setTimeout(function(){
        callbackFn(MOCK_ROUNDS, MOCK_GOLFERS, getCourse(), getStatInfo())
    }, 100);
}

function getCourse() {
    let golfCourseName = '';
    for (let i = 0; i < MOCK_COURSES.golfCourses.length; i++) {
        if (MOCK_COURSES.golfCourses[i].courseId === MOCK_ROUNDS.golfRounds[i].courseId) {
            return golfCourseName = MOCK_COURSES.golfCourses[i];
        } else {
            return golfCourseName = "Unknown course";
        }
    }
}

function getStatInfo() {
    let runningSum = 0;
    let runningSumArray = [];
    let overParAvg;
    for (let i = 0; i < MOCK_ROUNDS.golfRounds.length; i++) {
        if (MOCK_ROUNDS.golfRounds[i].holeScores.length < 10) {
            runningSumArray.push(((MOCK_ROUNDS.golfRounds[i].holeScores.reduce((a,b) => a+b, 0))*2)-72);
        } else {
            runningSumArray.push((MOCK_ROUNDS.golfRounds[i].holeScores.reduce((a,b) => a+b, 0))-72);
        }
    }
    overParAvg = (runningSumArray.reduce((a,b) => a+b, 0)/runningSumArray.length);;

    let handicapDiffArray = [];
    let sortedHandicapArray = [];
    for (let i = 0; i < MOCK_ROUNDS.golfRounds.length; i++) {
        if (MOCK_ROUNDS.golfRounds[i].holeScores.length > 10) {
            handicapDiffArray.push((MOCK_ROUNDS.golfRounds[i].holeScores.reduce((a,b) => a+b, 0) - MOCK_COURSES.golfCourses[0].courseRating) * 113 / MOCK_COURSES.golfCourses[0].courseSlope);
        } else if (MOCK_ROUNDS.golfRounds[i].holeScores.length < 10) {
            handicapDiffArray.push(((MOCK_ROUNDS.golfRounds[i].holeScores.reduce((a,b) => a+b, 0)*2) - (MOCK_COURSES.golfCourses[0].courseRating*2)) * 113 / MOCK_COURSES.golfCourses[0].courseSlope);
        } 
    }
    sortedHandicapArray = handicapDiffArray.sort();
    let handicapResult = 0;
    if (MOCK_ROUNDS.golfRounds.length <= 6) {
        for(let i = 0; i < 1; i++) {
            handicapResult = sortedHandicapArray[i];
        }
    } else if (MOCK_ROUNDS.golfRounds.length <= 8) {
        for(let i = 0; i < 2; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 2;
    } else if (MOCK_ROUNDS.golfRounds.length <= 10) {
        for(let i = 0; i < 3; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 3;
    } else if (MOCK_ROUNDS.golfRounds.length <= 12) {
        for(let i = 0; i < 4; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 4;
    } else if (MOCK_ROUNDS.golfRounds.length <= 14) {
        for(let i = 0; i < 5; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 5;
    } else if (MOCK_ROUNDS.golfRounds.length <= 16) {
        for(let i = 0; i < 6; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 6;
    } else if (MOCK_ROUNDS.golfRounds.length <= 17) {
        for(let i = 0; i < 7; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 7;
    } else if (MOCK_ROUNDS.golfRounds.length <=  18) {
        for(let i = 0; i < 8; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 8;
    } else if (MOCK_ROUNDS.golfRounds.length <= 19) {
        for(let i = 0; i < 9; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 9;
    } else if (MOCK_ROUNDS.golfRounds.length <= 20) {
        for(let i = 0; i < 10; i++) {
            handicapResult = handicapResult + sortedHandicapArray[i];
        }
        handicapResult = handicapResult / 10;
    }
    handicapResult = Math.round(handicapResult * 10) / 10;

    let statReturnArray = [overParAvg, handicapResult];
    //need to fix handicap algorthm to only take last 20 rounds(if more than 20 rounds).
    return statReturnArray;
}

function displayGolfInfo(rounds, golfers, courses, stats) {

    $('#golfer-info').append(`
    ${golfers.golfers[0].golferName.firstName} ${golfers.golfers[0].golferName.lastName}
    <hr>
    `)

    $('#stat-info').append(`
        Current over par average: ${stats[0]}<br>
        Current USGA Handicap: ${stats[1]}
        <hr>
    `)

    rounds.golfRounds.forEach(function(element) {
        let roundScore = element.holeScores.reduce((a,b) => a+b, 0);
        $('#round-info').append(`
            ${element.roundDate} | 
            ${courses.courseName} |
            ${element.holeScores} = ${roundScore} |
            ${courses.totalPar} |
            +${roundScore - courses.totalPar} |
            <br>
        `)
    });
}

function getAndDisplayInfo() {
    getGolfInfo(displayGolfInfo);
}

$(getAndDisplayInfo);

const MOCK_ROUNDS = {
    "golfRounds": [
        {
            "roundId": "1111111111",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "8/12/2018",
            "holeScores": [6,6,5,7,6,6,6,5,7],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111112",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "7/12/2018",
            "holeScores": [7,5,6,6,7,5,7,4,8],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111113",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "6/12/2018",
            "holeScores": [10,10,5,7,6,6,5,4,5],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111114",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "5/12/2018",
            "holeScores": [6,6,5,5,6,5,6,5,7],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111115",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "4/12/2018",
            "holeScores": [6,6,5,10,10,6,5,4,7],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111116",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "3/12/2018",
            "holeScores": [6,6,5,6,6,6,6,5,8],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111117",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "2/12/2018",
            "holeScores": [6,10,5,6,5,6,6,5,7],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111118",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "1/12/2018",
            "holeScores": [6,6,5,7,6,6,6,5,6],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111119",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "12/12/2017",
            "holeScores": [6,6,4,7,6,8,6,4,7],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
        },
        {
            "roundId": "1111111120",
            "golferId": "aaaaaaaaaa",
            "courseId": "111aaa111a",
            "roundDate": "11/12/2017",
            "holeScores": [6,6,5,10,6,6,5,5,7],
            "roundScore": function() {
                return this.holeScores.reduce((a,b) => a+b, 0);
            }
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