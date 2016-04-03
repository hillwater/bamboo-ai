/**
 * Created by ubuntu on 3/19/16.
 */

function WebsocketConnector(io) {

    io.sockets.on('connection', function (socket) {
        socket.on('client-event', function (data) {
            console.log(data);
            socket.emit('server-event', "hello: "+ data);
        });

    });
}

module.exports = WebsocketConnector;

