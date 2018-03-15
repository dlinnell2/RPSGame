$(document).ready(function () {

    var db = firebase.database();

    var playerOneChoice;
    var playerTwoChoice;

    var playerOne;
    var playerTwo;

    var playerName;

    var turn = db.ref('/turn')

    var choices = db.ref('/choice');

    db.ref('/users').on('value', function (snap) {

        playOneExist = snap.child('/one').exists();

        playTwoExist = snap.child('/two').exists();

        playerOne = snap.child('/one').val();

        playerTwo = snap.child('/two').val();

        if (playOneExist && playTwoExist) {
            $('#status').text('We have two players! Time to begin!');

            $('#outcome').text('');

            $('#pOneWin').text(playerOne.wins);
            $('#pOneLoss').text(playerOne.losses);
            $('#pOneTie').text(playerOne.ties);

            $('#pTwoWin').text(playerTwo.wins);
            $('#pTwoLoss').text(playerTwo.losses);
            $('#pTwoTie').text(playerTwo.ties);

            setTimeout(gamePlayerOne, 2000);
        }

        if (!playOneExist || !playTwoExist) {
            turn.set(1);
        }

        console.log(playOneExist);

    }, function (errorObject) {

        console.log("The read failed: " + errorObject.code);

    });

    turn.on('value', function (snap) {

        console.log(snap.val());

        if (snap.val() === 2) {
            gamePlayerTwo();
        } else if (snap.val() === 3) {
            outcome();
        }
    })

    choices.on('value', function (snap) {

        if (snap.child('/playerOne').exists()) {
            playerOneChoice = snap.child('/playerOne').val();
        }

        if (snap.child('/playerTwo').exists()) {
            playerTwoChoice = snap.child('/playerTwo').val();
        }

    })


    // Making new players
    function makePlayer() {

        event.preventDefault();

        if (!(playOneExist && playTwoExist)) {

            if (!playOneExist) {

                playerName = $('#newPlayer').val().trim();

                var player = db.ref('/users/one');

                player.set({
                    name: playerName,
                    wins: 0,
                    losses: 0,
                    ties: 0,
                });

                player.onDisconnect().remove();

                $('#status').text('Welcome ' + playerName + '! Waiting on Player 2!');

                $('#currentPlayer').text('Current Player: ' + playerName);

                $('#newPlayer').val('');


                turn.set(1);

                console.log(playerName);

            } else if (!playTwoExist) {

                playerName = $('#newPlayer').val().trim();

                var player = db.ref('/users/two');

                player.set({
                    name: playerName,
                    wins: 0,
                    losses: 0,
                    ties: 0,
                });

                player.onDisconnect().remove();

                $('#currentPlayer').text('Current Player: ' + playerName);

                $('#newPlayer').val('');

                console.log(playerName);

                turn.set(1);

            };


        } else {

            alert('Sorry, this game is full');

        }

    };

    // Running of game for player One
    function gamePlayerOne() {

        if (playerName === playerOne.name) {

            $('#opponent').text('Your opponent is ' + playerTwo.name);

            // Set text for player one's choices
            $('#rockOne').text('rock');
            $('#paperOne').text('paper');
            $('#scissorsOne').text('scissors')

            // Show the choices
            $('.choiceOne').show();
            $('#waitingOne').hide();

            // Hide any information left over from previous games
            $('.choiceTwo').hide();
            $('#waitingTwo').hide();

            $('#status').text(playerName + ' make your choice!')

            // Once player one has clicked their selection
            $('.choiceOne').on('click', function () {

                var choice = $(this).text();

                $('#status').text('You chose ' + choice);

                db.ref('/choice/playerOne').set(choice);

                turn.set(2);

            });

        } else if (playerName === playerTwo.name) {

            $('#opponent').text('Your opponent is ' + playerOne.name);

            // Set text for player two's status
            $('#waitingTwo').text('Waiting on ' + playerOne.name);

            $('#status').text('');

            // Show the status
            $('#waitingTwo').show();
            $('.choiceTwo').hide();

        };

    };

    // Running of game for player Two
    function gamePlayerTwo() {

        console.log(playerName);

        if (playerName === playerTwo.name) {

            // Set text for player two's choices
            $('#rockTwo').text('rock');
            $('#paperTwo').text('paper');
            $('#scissorsTwo').text('scissors')

            // Show the choices
            $('.choiceTwo').show();
            $('#waitingTwo').hide();

            // Hide any information left over from previous games
            $('.choiceOne').hide();
            $('#waitingOne').hide();

            $('#status').text(playerName + ' make your choice!')

            // Once player one has clicked their selection
            $('.choiceTwo').on('click', function () {

                var choice = $(this).text();

                db.ref('/choice/playerTwo').set(choice);

                $('#status').text('You chose ' + choice);

                setTimeout(function () { turn.set(3) }, 1000);



            });

        } else if (playerName === playerOne.name) {

            // Set text for player two's status
            $('#waitingOne').text('Waiting on ' + playerTwo.name);

            // Show the status
            $('#waitingOne').show();
            $('.choiceOne').hide();

        };

    };

    function playerOneWins() {

        // Display Player One won in outcome
        $('#outcome').text(playerOne.name + ' won!');
        $('#status').text('Stay put! A new game will begin shortly!');

        // After 2 seconds, update info in database, will automatically trigger new game
        setTimeout(function () {


            var playWins = playerOne.wins;
            playWins++
            db.ref().child('/users/one/wins').set(playWins);

            var playLoss = playerTwo.losses;
            playLoss++
            db.ref().child('/users/two/losses').set(playLoss);

        }, 2000);

    };

    function playerTwoWins() {

        // Display Player Two won in outcome
        $('#outcome').text(playerTwo.name + ' won!');
        $('#status').text('Stay put! A new game will begin shortly!');

        // After 2 seconds, update info in database, will automatically trigger new game
        setTimeout(function () {

            var playWins = playerTwo.wins;
            playWins++
            db.ref().child('/users/two/wins').set(playWins);

            var playLoss = playerOne.losses;
            playLoss++
            db.ref().child('/users/one/losses').set(playLoss);

        }, 2000);
    };

    function tie() {

        //Display that players tied in outcome
        $('#outcome').text('Tie!')
        $('#status').text('Stay put! A new game will begin shortly!')

        // After 2 seconds, update information in database, will trigger new game
        setTimeout(function () {

            var tie = playerOne.ties;
            tie++
            db.ref().child('/users/one/ties').set(tie);
            db.ref().child('/users/two/ties').set(tie);

        }, 2000);

    };

    // Evaluate a winner
    function outcome() {

        $('#waitingOne').text(playerOne.name + ' chose ' + playerOneChoice);
        $('#waitingTwo').text(playerTwo.name + ' chose ' + playerTwoChoice);

        $('.choiceTwo').hide();
        $('#waitingTwo').show();

        console.log('hitting outcome function');

        console.log(playerOneChoice, playerTwoChoice);

        if (playerOneChoice === playerTwoChoice) {

            console.log('getting into tie');

            tie();

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

    };

    $('#makePlayer').on('click', makePlayer);


});
