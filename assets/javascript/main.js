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

    $(document).on('click', makePlayer);

    function makePlayer() {

        playerName = 'Chuck'

        db.ref('one').set({
            name: playerName,
            wins: 0,
            losses: 0,
            ties: 0,
        })

        pOneDb = db.ref('one');


    }

});