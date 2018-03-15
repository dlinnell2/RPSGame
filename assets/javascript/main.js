$(document).ready(function () {

    var db = firebase.database();

    var playerTie;

    var playerOneChoice;
    var playerTwoChoice;

    var playerOne;
    var playerTwo;

    var playerName;

    var turn;

    db.ref('/users').on('value', function (snap) {

        playOneExist = snap.child('/one').exists();

        playTwoExist = snap.child('/two').exists();

        playerOne = snap.child('/one').val();

        playerTwo = snap.child('/two').val();

        console.log(playOneExist);

    }, function (errorObject) {

        console.log("The read failed: " + errorObject.code);

    });

    db.ref('/users').on('child_added', function (snap) {

        if (playOneExist && playTwoExist) {

            console.log('now we can freaking start');
        }

    });

    db.ref('/turn').on('value', function(snap){

        if (snap.val() === 2) {
            console.log('player 2 turn');
        }
        
    })


    // Making new players
    function makePlayer() {

        event.preventDefault();

        if (!(playOneExist && playTwoExist)) {

            if (!playOneExist) {

                playerName = $('#newPlayer').val().trim();

                db.ref('/users/one').set({
                    name: playerName,
                    wins: 0,
                    losses: 0,
                    ties: 0,
                });

                db.ref('/users/one').onDisconnect().remove();

                $('#newPlayer').val('');

                $('#waitingOne').text('Waiting on player 2');

                console.log(playerName);

            } else if (!playTwoExist) {

                playerName = $('#newPlayer').val().trim();

                db.ref('/users/two').set({
                    name: playerName,
                    wins: 0,
                    losses: 0,
                    ties: 0,
                });

                db.ref('/users/two').onDisconnect().remove();

                $('#newPlayer').val('');

                turn = 1;

                db.ref().child('/turn').set(turn);

                console.log(playerName);

            };


        } else {

            alert('Sorry, this game is full');

        }

    };

    // Running of game for player One
    function gamePlayerOne() {

        if (playerName === playerOne.name) {

            // Set text for player one's choices
            $('#rockOne').text('rock');
            $('#paperOne').text('paper');
            $('#scissorsOne').text('scissors')

            // Show the choices
            $('.choiceOne').show();
            $('#waitingOne').hide();

            $('#outcome').text(playerName + ' make your choice!')

            // Once player one has clicked their selection
            $('.choiceOne').on('click', function () {

                playerOneChoice = $(this).text();

                turn = 2;

                db.ref().child('/turn').set(turn);

            });

        } else if (playerName === playerTwo.name) {

            // Set text for player two's status
            $('#waitingTwo').text('Waiting on ' + playerOne.name);

            $('#outcome').text('');

            // Show the status
            $('#waitingTwo').show();
            $('.choiceTwo').hide();

        };

    };

    // Running of game for player Two
    function gamePlayerTwo() {

        if (playerName === playerTwo.name) {

            // Set text for player two's choices
            $('#rockTwo').text('rock');
            $('#paperTwo').text('paper');
            $('#scissorsTwo').text('scissors')

            // Show the choices
            $('.choiceTwo').show();
            $('#waitingTwo').hide();

            ('#outcome').text(playerName + ' make your choice!')

            // Once player one has clicked their selection
            $('.choiceTwo').on('click', function () {

                playerTwoChoice = $(this).text();

                console.log('Check the answers');

            });

        } else if (playerName === playerOne.name) {

            // Set text for player two's status
            $('#waitingOne').text('Waiting on ' + playerTwo.name);

            // Show the status
            $('#waitingOne').show();
            $('.choiceOne').hide();

        };

    };

    /* function playerOneWins() {
 
        // Update player one's wins on database
        var playWins = playerOne.wins;
        playWins++
        db.ref().child('/one/wins').set(playWins);
 
        // Update player two's loss on database
        var playLoss = playerTwo.losses;
        playLoss++
        db.ref().child('/two/losses').set(playLoss);
 
    }
 
    function playerTwoWins() {
 
        // Update player two's wins on database
        var playWins = playerTwo.wins;
        playWins++
        db.ref().child('/two/wins').set(playWins);
 
        // Update player one's loss on database
        var playLoss = playerOne.losses;
        playLoss++
        db.ref().child('/one/losses').set(playLoss);
    }
 
    // Evaluate a winner
    function outcome() {
 
        $('#waitingOne, .choiceTwo').hide();
 
        if (playerOneChoice === playerTwoChoice) {
 
            console.log('tie');
 
        } else if (playerOneChoice === 'rock') {
 
            if (playerTwoChoice === 'scissors') {
                playerOneWins();
 
            } else if (playerTwoChoice === 'paper') {
                playerTwoWins(); 
 
            };
 
        } else if (playerOneChoice === 'scissors') {
 
            if (playerTwoChoice === 'paper') {
                playerOneWins();
 
            } else if (playerTwoChoice === 'rock') {
                playerTwoWins();
 
            };
 
        } else if (playerOneChoice === 'paper') {
 
            if (playerTwoChoice === 'rock') {
                playerOneWins();
 
            } else if (playerTwoChoice === 'scissors') {
                playerTwoWins();
 
            };
        };
 
    }; */

    $('#makePlayer').on('click', makePlayer);


});