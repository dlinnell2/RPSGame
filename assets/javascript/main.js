$(document).ready(function () {

    // Global variables
    var playerOneChoice;
    var playerTwoChoice;
    var playerOne;
    var playerTwo;
    var playerName;

    // Commonly used database paths
    var db = firebase.database();
    var turn = db.ref('/turn')
    var choices = db.ref('/choice');
    var chat = db.ref('/chat');
    var users = db.ref('/users');

    // Used to check if both players are present, triggers new game when so
    users.on('value', function (snap) {

        // Setting variables to check if a player exists and designating a player to a database path
        playOneExist = snap.child('/one').exists();
        playerOne = snap.child('/one').val();

        playTwoExist = snap.child('/two').exists();
        playerTwo = snap.child('/two').val();

        // If both players are present
        if (playOneExist && playTwoExist) {
            
            // Let players know the game is about to start
            $('#starting').text('We have two players! Time to begin!');
            $('#starting').show();

            // Updating live win/loss/tie counts for each user
            $('#pOneWin').text(playerOne.wins);
            $('#pOneLoss').text(playerOne.losses);
            $('#pOneTie').text(playerOne.ties);

            $('#pTwoWin').text(playerTwo.wins);
            $('#pTwoLoss').text(playerTwo.losses);
            $('#pTwoTie').text(playerTwo.ties);

            // Trigger new game after 2 seconds - gives players time to realize game is starting
            setTimeout(gamePlayerOne, 2000);
        }

        // If either player leaves, or if we are still waiting on one
        if (!playOneExist || !playTwoExist) {
            turn.remove();
            choices.remove();

            $('#starting').text('Waiting on players');
            $('#starting').show();

        }

        // If both players leave, completely clear chat
        if (!playOneExist && !playTwoExist) {
            chat.remove();
        }

        // If the connection to the database fails
    }, function (errorObject) {

        console.log("The read failed: " + errorObject.code);

    });

    // Triggers when a user leaves the came
    users.on('child_removed', function (snap){

        // Grab that users name and send a message on chat
        player = snap.val().name;
        chat.push(player + ' has disconnected!')

        // Hide all choices and any other messages so that other user cannot miss their opponent left
        $('#waitingOne').hide();
        $('#waitingTwo').hide();
        $('.choiceOne').hide();
        $('.choiceTwo').hide();

        // Display a status only to the player that is still connected
        if (playerName === playerOne.name || playerName === playerTwo.name){
        $('#status').text('Sorry! Your opponent has left the game! Waiting for another to join');
        $('#status').show();
        };

    })

    // Triggers when the turn number changes
    turn.on('value', function (snap) {

        // Turn is used only to change to player two's turn and to determine a winner, a turn of one has no action
        if (snap.val() === 2) {
            gamePlayerTwo();

        } else if (snap.val() === 3) {
            outcome();
        }

    });

    // Updates when a player makes a choice
    choices.on('value', function (snap) {

        // Checks if it was player one or two that made choice, and stores that choice
        if (snap.child('/playerOne').exists()) {
            playerOneChoice = snap.child('/playerOne').val();
        }

        if (snap.child('/playerTwo').exists()) {
            playerTwoChoice = snap.child('/playerTwo').val();
        }

    })

    // Listens to messages added to chat
    chat.on('child_added', function (snap){
        
        // When message comes in, grab it's content, and push that into a new div
        var message = snap.val();
        var newChat = $('<div>').text(message).attr('class', 'chatMessage');

        // Check for alert messages, if none are found, determine if message is from local player or not and apply appropriate class for style
        if (message.includes('joined')){
            newChat.addClass('joined');
        } else if (message.includes('disconnected')){
            newChat.addClass('left');
        } else if (message.startsWith(playerName)){
            newChat.addClass('yourChat');
        };

        // If the player is still connected, add it to the chat windo
        if (playerName === playerOne.name || playerName === playerTwo.name) {
        newChat.appendTo('#chatWindow');

        // Automatically move the scroll position as the messages extend past what can be seen in initial window
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
