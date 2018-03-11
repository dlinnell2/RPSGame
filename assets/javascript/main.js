$(document).ready(function () {

    var db = firebase.database();

    //var playerOneWins;
    //var playerOneLosses;
    //var playerOneName;
    //var playerTwoWins;
    //var playerTwoLosses;
    //var PlayerTwoName;
    var playerTie;

    var pOneDb;
    var pTwoDb;

    var playOneExist = false;

    db.ref('/one').on('value', function (snap) {

        console.log('it changed');

    });

    db.ref('/two').on('value', function (snap) {

        console.log('Number two!')

    });

    function makePlayer() {

        if (playOneExist) {

            var playerName = 'Charles'

            db.ref('/two').set({
                name: playerName,
                wins: 0,
                losses: 0,
                ties: 0,
            });

        } else {

            var playerName = 'Chuck'

            db.ref('/one').set({
                name: playerName,
                wins: 0,
                losses: 0,
                ties: 0,
            });

            pOneDb = db.ref('/one');

            playOneExist = true;

        };


    }

    $(document).on('click', makePlayer);

});