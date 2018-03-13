$(document).ready(function () {

    var db = firebase.database();

    var playerOne;
    var playerTwo;
    var playerTie;

    var pOneDb;
    var pTwoDb;

    var playOneExist;
    var playTwoExist;

    var turn;

    db.ref().on('value', function (snap) {

        playOneExist = snap.child('/one').exists();

        playTwoExist = snap.child('/two').exists();

        if (playOneExist && playTwoExist) {
            console.log('Begin!');


            db.ref('/turn').set({
                turn : 1,
            });

            turn = snap.child('/turn').val();

            gameplay();
        }        


    }, function (errorObject) {

        console.log("The read failed: " + errorObject.code);

    });

    function makePlayer() {

        console.log(playOneExist);

        if (playOneExist) {

            var playerName = 'Charles'

            db.ref('/two').set({
                name: playerName,
                wins: 0,
                losses: 0,
                ties: 0,
            });

            playerTwo = db.ref('/two');

        } else {

            var playerName = 'Chuck'

            db.ref('/one').set({
                name: playerName,
                wins: 0,
                losses: 0,
                ties: 0,
            });

            playerOne = db.ref('/one');



        };


    }

    $('#one').on('click', makePlayer);

    function gameplay (){

        if (turn=1){
            console.log('First')
            

        } else if (turn=2) {
            console.log('Second')
        }
    }


});