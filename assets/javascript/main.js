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

    db.ref().on('value', function (snap){

        console.log('it changed');

    })

    function makePlayer() {

        playerName = 'Chuck'

        db.ref('/one').set({
            name: playerName,
            wins: 0,
            losses: 0,
            ties: 0,
        })

        pOneDb = db.ref('one');


    }

    $(document).on('click', makePlayer);

});