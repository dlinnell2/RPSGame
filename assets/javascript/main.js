$(document).ready(function () {

    var db = firebase.database();

    var playerOne;
    var playerTwo;
    var playerTie;

    var playerOneChoice;
    var playerTwoChoice;

    var playOneExist;
    var playTwoExist;

    var turn;

    db.ref().on('value', function (snap) {

        playOneExist = snap.child('/one').exists();

        playTwoExist = snap.child('/two').exists();

        playerOne = snap.child('/one').val();

        playerTwo = snap.child('/two').val();

    }, function (errorObject) {

        console.log("The read failed: " + errorObject.code);

    });

    // Making new players
    function makePlayer() {

        event.preventDefault();

        if(playOneExist && playTwoExist) {

            $('#outcome').text('Let\'s begin!');

            setTimeout(gamePlayerOne, 1000);

        } else if (playOneExist) {

            var playerName = $('#newPlayer').val().trim();

            db.ref('/two').set({
                name: playerName,
                wins: 0,
                losses: 0,
                ties: 0,
            });

            $('#outcome').text('Let\'s begin!');

            setTimeout(gamePlayerOne, 1000);

        } else {

            var playerName = $('#newPlayer').val().trim();

            db.ref('/one').set({
                name: playerName,
                wins: 0,
                losses: 0,
                ties: 0,
            });

        };


    }

    // Running of game for player One
    function gamePlayerOne (){

        $('#rockOne').text('rock');
        $('#paperOne').text('paper');
        $('#scissorsOne').text('scissors')

        $('.choiceOne').show();
        $('#waitingOne').hide();

        $('#waitingTwo').text('Waiting on ' + playerOne.name);

        $('#waitingTwo').show();
        $('.choiceTwo').hide();

        $('.choiceOne').on('click', function(){

            playerOneChoice = $(this).text();

            $('waitingOne').text('Waiting on ' + playerTwo.name);

            $('choiceOne').hide();
            $('#waitingOne').show();


        })

    }

    $('#makePlayer').on('click', makePlayer);


});