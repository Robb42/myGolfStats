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
    let runningSumArray = [];
    let overParAvg;
    for (let i = 0; i < MOCK_ROUNDS.golfRounds.length; i++) {
        if (MOCK_ROUNDS.golfRounds[i].holeScores.length < 10) {
            runningSumArray.push(((MOCK_ROUNDS.golfRounds[i].roundScore())*2)-72);
        } else {
            runningSumArray.push((MOCK_ROUNDS.golfRounds[i].roundScore())-72);
        }
    }
    overParAvg = (runningSumArray.reduce((a,b) => a+b, 0)/runningSumArray.length);;

    let handicapDiffArray = [];
    let sortedHandicapArray = [];
    for (let i = 0; i < MOCK_ROUNDS.golfRounds.length; i++) {
        if (MOCK_ROUNDS.golfRounds[i].holeScores.length > 10) {
            handicapDiffArray.push((MOCK_ROUNDS.golfRounds[i].roundScore() - MOCK_COURSES.golfCourses[0].courseRating) * 113 / MOCK_COURSES.golfCourses[0].courseSlope);
        } else if (MOCK_ROUNDS.golfRounds[i].holeScores.length < 10) {
            handicapDiffArray.push(((MOCK_ROUNDS.golfRounds[i].roundScore()*2) - (MOCK_COURSES.golfCourses[0].courseRating*2)) * 113 / MOCK_COURSES.golfCourses[0].courseSlope);
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

    //need to add conditional for 9 holes vs 18 since the best 9 hole day will always be best.  
    let bestRoundIndex = 0;
    let currentBestRoundValue = MOCK_ROUNDS.golfRounds[0].roundScore();
    for (let i = 1; i < MOCK_ROUNDS.golfRounds.length; i++) {
        if (MOCK_ROUNDS.golfRounds[i].roundScore() < currentBestRoundValue) {
            currentBestRoundValue = MOCK_ROUNDS.golfRounds[i].roundScore();
            bestRoundIndex = i;
        }
    }
    let bestRound = MOCK_ROUNDS.golfRounds[bestRoundIndex];

    let statReturnArray = [overParAvg, handicapResult, bestRound];
    //need to fix handicap algorthm to only take last 20 rounds(if more than 20 rounds).
    return statReturnArray;
}




function displayGolfInfo(rounds, golfers, courses, stats) {
    //Display golfer name
    $('#golfer-info').append(`
    ${golfers.golfers[0].golferName.firstName} ${golfers.golfers[0].golferName.lastName}
    `)

    //Display stats
    $('#stat-info').append(`
        USGA Handicap: ${stats[1]}<br>
        Avg shots over par per round (18 holes): ${stats[0]}<br>
        Best round: ${stats[2].roundDate} @ ${courses.courseName} - shot a ${stats[2].roundScore()} over ${stats[2].holeScores.length} holes on a Par ${courses.totalPar()}
    `)

    //Display rounds
    rounds.golfRounds.forEach(function(element) {
        $('#round-results').append(`
            <p hidden>${element.roundId}</p>
            <p>${element.roundDate} | 
            ${courses.courseName} | 
            ${courses.courseLocation}<br>
            Holes played: ${element.holeScores.length} |
            Shots ${element.roundScore()} |
            Course Par ${courses.totalPar()} |
            Score +${element.roundScore() - courses.totalPar()}
            </p>
            <button class="editRoundButton">Edit Round</button>
        `)
    });    

}




function getCourseOptions() {
    MOCK_COURSES.golfCourses.forEach(function(item) {
        console.log(item);
        let selectCourse = document.getElementById("course-picker");
        let optionElement = document.createElement("option");

        optionElement.textContent = item.courseName;
        
        selectCourse.appendChild(optionElement);
        
    })
}




function getEditRoundInfo(id) {
    for (let i = 0; i < MOCK_ROUNDS.golfRounds.length; i++) {
        if (MOCK_ROUNDS.golfRounds[i].roundId == id) {
            let editRoundDate = MOCK_ROUNDS.golfRounds[i].roundDate;
            let editCourseId = MOCK_ROUNDS.golfRounds[i].courseId;
            for (let j = 0; j < MOCK_COURSES.golfCourses.length; j++) {
                if (MOCK_COURSES.golfCourses[j].courseId == editCourseId) {
                    $('#edit-date-course').text(`
                        Editing ${editRoundDate} round at ${MOCK_COURSES.golfCourses[j].courseName}
                    `);
                }
            } 
        }
    }
}




function editRoundScores(scores) {
    console.log(scores);
}




function addRoundScores(scores, course, date) {
    console.log(scores, course, date);
}




function clickWatcher() {
    //add round button on home page
    $("#round-info").on('click', '#add-round-button', function() {
        $('#player-card').prop('hidden', true);
        $('#add-round').prop('hidden', false);
        $('#edit-round').prop('hidden', true);
        $('#add-course').prop('hidden', true);
        getCourseOptions();
    })    

    //submit add round
    $("#add-new-round").submit(function() {
        event.preventDefault();
        $('#player-card').prop('hidden', false);
        $('#add-round').prop('hidden', true);
        $('#edit-round').prop('hidden', true);
        $('#add-course').prop('hidden', true);
        let course = $("#course-picker").val();
        let date = $("#date-picker").val();
        let hole1 = $("#first-hole").val();
        let hole2 = $("#second-hole").val();
        let hole3 = $("#third-hole").val();
        let hole4 = $("#fourth-hole").val();
        let hole5 = $("#fifth-hole").val();
        let hole6 = $("#sixth-hole").val();
        let hole7 = $("#seventh-hole").val();
        let hole8 = $("#eighth-hole").val();
        let hole9 = $("#ninth-hole").val();
        let hole10 = $("#tenth-hole").val();
        let hole11 = $("#eleventh-hole").val();
        let hole12 = $("#twelfth-hole").val();
        let hole13 = $("#thirteenth-hole").val();
        let hole14 = $("#fourteenth-hole").val();
        let hole15 = $("#fifteenth-hole").val();
        let hole16 = $("#sixteenth-hole").val();
        let hole17 = $("#seventeenth-hole").val();
        let hole18 = $("#eighteenth-hole").val();
        const addRoundScoresArray = [hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18];
        addRoundScores(addRoundScoresArray, course, date);
    })

    //cancel add round 
    $("#edit-round-form").submit(function() {
        $('#player-card').prop('hidden', false);
        $('#add-round').prop('hidden', true);
        $('#edit-round').prop('hidden', true);
        $('#add-course').prop('hidden', true);
    })

    //submit add course
    $("#add-round").on('click', '#new-course-button', function() {
        $('#player-card').prop('hidden', true);
        $('#add-round').prop('hidden', true);
        $('#edit-round').prop('hidden', true);
        $('#add-course').prop('hidden', false);
    })

    //edit a round button on home page
    $('#round-results').on('click','.editRoundButton', function(){ 
        let selectedRound = $(this).prev().prev().text();
        $('#player-card').prop('hidden', true);
        $('#add-round').prop('hidden', true);
        $('#edit-round').prop('hidden', false);
        $('#add-course').prop('hidden', true); 
        getEditRoundInfo(selectedRound);
    })

    //submit edit round 
    $("#edit-round-form").submit(function() {
        event.preventDefault();
        $('#player-card').prop('hidden', false);
        $('#add-round').prop('hidden', true);
        $('#edit-round').prop('hidden', true);
        $('#add-course').prop('hidden', true);
        let hole1 = $("#first-hole-edit").val();
        let hole2 = $("#second-hole-edit").val();
        let hole3 = $("#third-hole-edit").val();
        let hole4 = $("#fourth-hole-edit").val();
        let hole5 = $("#fifth-hole-edit").val();
        let hole6 = $("#sixth-hole-edit").val();
        let hole7 = $("#seventh-hole-edit").val();
        let hole8 = $("#eighth-hole-edit").val();
        let hole9 = $("#ninth-hole-edit").val();
        let hole10 = $("#tenth-hole-edit").val();
        let hole11 = $("#eleventh-hole-edit").val();
        let hole12 = $("#twelfth-hole-edit").val();
        let hole13 = $("#thirteenth-hole-edit").val();
        let hole14 = $("#fourteenth-hole-edit").val();
        let hole15 = $("#fifteenth-hole-edit").val();
        let hole16 = $("#sixteenth-hole-edit").val();
        let hole17 = $("#seventeenth-hole-edit").val();
        let hole18 = $("#eighteenth-hole-edit").val();
        const editRoundScoresArray = [hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18];
        console.log(editRoundScoresArray);
        editRoundScores(editRoundScoresArray);
    })

    //cancel edit round 
    $("#edit-round-form").submit(function() {
        $('#player-card').prop('hidden', false);
        $('#add-round').prop('hidden', true);
        $('#edit-round').prop('hidden', true);
        $('#add-course').prop('hidden', true);
    })
}




function getAndDisplayInfo() {
    getGolfInfo(displayGolfInfo);
    clickWatcher();
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
            "totalPar": function() {
                return this.coursePars.reduce((a,b) => a+b, 0);
            },
            "courseRating": "35.6",
            "courseSlope": "125",
            "coursePars": [4,4,3,5,4,4,4,3,5]
        },
        {
            "courseId": "111aaa111b",
            "courseName": "TEST Country Club",
            "courseLocation": "Derry, New Hampshire",
            "nineOrEighteen": "9",
            "totalPar": function() {
                return this.coursePars.reduce((a,b) => a+b, 0);
            },
            "courseRating": "35.6",
            "courseSlope": "125",
            "coursePars": [4,4,3,5,4,4,4,3,5]
        }
    ]
}