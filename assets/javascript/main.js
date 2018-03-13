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

        if (playOneExist && playTwoExist) {

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
    function gamePlayerOne() {

        // Set text for player one's choices
        $('#rockOne').text('rock');
        $('#paperOne').text('paper');
        $('#scissorsOne').text('scissors')

        // Show the choices
        $('.choiceOne').show();
        $('#waitingOne').hide();

        // Set text for player two's status
        $('#waitingTwo').text('Waiting on ' + playerOne.name);

        // Show the status
        $('#waitingTwo').show();
        $('.choiceTwo').hide();

        // Once player one has clicked their selection
        $('.choiceOne').on('click', function () {

            playerOneChoice = $(this).text();

            gamePlayerTwo();

        })

    }

    // Running of game for player Two
    function gamePlayerTwo() {

        // Set text for player two's choices
        $('#rockTwo').text('rock');
        $('#paperTwo').text('paper');
        $('#scissorsTwo').text('scissors')

        // Show the choices
        $('.choiceTwo').show();
        $('#waitingTwo').hide();

        // Set text for player two's status
        $('#waitingOne').text('Waiting on ' + playerTwo.name);

        // Show the status
        $('#waitingOne').show();
        $('.choiceOne').hide();

        // Once player one has clicked their selection
        $('.choiceTwo').on('click', function () {

            playerTwoChoice = $(this).text();

            outcome();

        });

    };

    // Evaluate a winner
    function outcome() {

        $('#waitingOne, .choiceTwo').hide();

        if (playerOneChoice === playerTwoChoice) {

            console.log('tie')

        } else if (playerOneChoice === 'rock') {

            if (playerTwoChoice === 'scissors') {
                var playWins = playerOne.wins;
                playWins++
                db.ref().child('/one/wins').set
                (playWins);

            };
        };

    };

    $('#makePlayer').on('click', makePlayer);


});