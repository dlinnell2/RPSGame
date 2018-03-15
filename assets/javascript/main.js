$(document).ready(function () {

    var playerOneChoice;
    var playerTwoChoice;
    var playerOne;
    var playerTwo;
    var playerName;

    var db = firebase.database();
    var turn = db.ref('/turn')
    var choices = db.ref('/choice');
    var chat = db.ref('/chat');
    var users = db.ref('/users');

    users.on('value', function (snap) {

        playOneExist = snap.child('/one').exists();
        playerOne = snap.child('/one').val();

        playTwoExist = snap.child('/two').exists();
        playerTwo = snap.child('/two').val();

        if (playOneExist && playTwoExist) {
            $('#starting').text('We have two players! Time to begin!');
            $('#starting').show();

            $('#pOneWin').text(playerOne.wins);
            $('#pOneLoss').text(playerOne.losses);
            $('#pOneTie').text(playerOne.ties);

            $('#pTwoWin').text(playerTwo.wins);
            $('#pTwoLoss').text(playerTwo.losses);
            $('#pTwoTie').text(playerTwo.ties);

            setTimeout(gamePlayerOne, 2000);
        }

        if (!playOneExist || !playTwoExist) {
            turn.remove();
            choices.remove();

            $('#starting').text('Waiting on players');
            $('#starting').show();

        }

        if (!playOneExist && !playTwoExist) {
            chat.remove();
        }

    }, function (errorObject) {

        console.log("The read failed: " + errorObject.code);

    });

    users.on('child_removed', function (snap){
        player = snap.val().name;

        chat.push(player + ' has disconnected!')

        $('#waitingOne').hide();
        $('#waitingTwo').hide();
        $('.choiceOne').hide();
        $('.choiceTwo').hide();

        if (playerName === playerOne.name || playerName === playerTwo.name){
        $('#status').text('Sorry! Your opponent has left the game! Waiting for another to join');
        $('#status').show();
        };

    })

    turn.on('value', function (snap) {

        if (snap.val() === 2) {
            gamePlayerTwo();

        } else if (snap.val() === 3) {
            outcome();
        }

    });

    choices.on('value', function (snap) {

        if (snap.child('/playerOne').exists()) {
            playerOneChoice = snap.child('/playerOne').val();
        }

        if (snap.child('/playerTwo').exists()) {
            playerTwoChoice = snap.child('/playerTwo').val();
        }

    })

    chat.on('child_added', function (snap){
        var message = snap.val();
        var newChat = $('<div>').text(message).attr('class', 'chatMessage');

        
        if (message.includes('joined')){
            newChat.addClass('joined');
        } else if (message.includes('disconnected')){
            newChat.addClass('left');
        } else if (message.startsWith(playerName)){
            newChat.addClass('yourChat');
        };

        if (playerName === playerOne.name || playerName === playerTwo.name) {
        newChat.appendTo('#chatWindow');
        $('#chatWindow').scrollTop($('#chatWindow')[0].scrollHeight);
        };
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

                $('#status').text('Welcome ' + playerName + '!');

                $('#currentPlayer').text('Current Player: ' + playerName);

                $('#newPlayer').val('');

                turn.set(1);

                chat.push(playerName + ' has joined!')

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

                $('#status').text('Welcome ' + playerName + '!');

                $('#currentPlayer').text('Current Player: ' + playerName);

                $('#newPlayer').val('');

                turn.set(1);

                chat.push(playerName + ' has joined!')

            };


        } else {

            alert('Sorry, this game is full');

        }

    };

    // Running of game for player One
    function gamePlayerOne() {

        $('#outcome').hide();
        $('#starting').hide();

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
                $('#status').show();

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
            $('#waitingOne').hide();

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
                $('#status').show();

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
        $('#outcome').show();
        $('#status').show();

        // After 4 seconds, update info in database, will automatically trigger new game
        setTimeout(function () {


            var playWins = playerOne.wins;
            playWins++
            db.ref().child('/users/one/wins').set(playWins);

            var playLoss = playerTwo.losses;
            playLoss++
            db.ref().child('/users/two/losses').set(playLoss);

        }, 4000);

        turn.set(1);

    };

    function playerTwoWins() {

        // Display Player Two won in outcome
        $('#outcome').text(playerTwo.name + ' won!');
        $('#status').text('Stay put! A new game will begin shortly!');
        $('#outcome').show();
        $('#status').show();


        // After 4 seconds, update info in database, will automatically trigger new game
        setTimeout(function () {

            var playWins = playerTwo.wins;
            playWins++
            db.ref().child('/users/two/wins').set(playWins);

            var playLoss = playerOne.losses;
            playLoss++
            db.ref().child('/users/one/losses').set(playLoss);

        }, 4000);

        turn.set(1);
    };

    function tie() {

        //Display that players tied in outcome
        $('#outcome').text('Tie!')
        $('#outcome').show();
        $('#status').text('Stay put! A new game will begin shortly!')


        // After 2 seconds, update information in database, will trigger new game
        setTimeout(function () {

            var tie = playerOne.ties;
            tie++
            db.ref().child('/users/one/ties').set(tie);
            db.ref().child('/users/two/ties').set(tie);

        }, 4000);

        turn.set(1);

    };

    // Evaluate a winner
    function outcome() {

        $('#waitingOne').text(playerOne.name + ' chose ' + playerOneChoice);
        $('#waitingTwo').text(playerTwo.name + ' chose ' + playerTwoChoice);

        $('.choiceTwo').hide();
        $('#waitingTwo').show();
        $('#waitingOne').show();

        if (playerOneChoice === playerTwoChoice) {

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

    function newChat (){

        event.preventDefault();

        if (playerName){
        
        var message = playerName + ': ' + $('#chatMessage').val().trim();
        chat.push(message);

        } else {
            alert('Please enter your name to begin playing!');
        }

        $('#chatMessage').val('');
        
    }

    $('#makePlayer').on('click', makePlayer);

    $('#newChat').on('click', newChat);

});
