$(document).ready(function() {
    console.log( "ready!" );

    $('#mq_test').on('click', function() {
        $.ajax('/test/mqtest').done(function(res) {
            $('#result').html(res.result);
        });
    });

    $('#db_test').on('click', function() {
        $.ajax('/test/dbtest').done(function(res) {
            $('#result').html(JSON.stringify(res));
        });
    });

    $('#redis_test').on('click', function() {
        $.ajax('/test/redistest').done(function(res) {
            $('#result').html(JSON.stringify(res));
        });
    });

    $('#data_access_test').on('click', function() {
        $.ajax('/test/data-access-test').done(function(res) {
            $('#result').html(JSON.stringify(res));
        });
    });

    $('#gomoku_test').on('click', function() {
        $.ajax('/test/gomoku-test').done(function(res) {
            $('#result').html(JSON.stringify(res));
        });
    });

    var count = 0;

    $('#websocket_test').on('click', function() {
        socket.emit('client-event', count);

        count++;
    });


    var socket = io.connect();
    socket.on('server-event', function (data) {
        $('#result').html(""+data);
    })
});