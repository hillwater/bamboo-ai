var amqp = require('amqplib/callback_api');
var uuid = require('node-uuid');
var dataAccess = require('./dataAccess');

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;
function start() {
  amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    }
    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });
    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });
    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}

function whenConnected() {
  startPublisher();
}

var pubChannel = null;
var requestQueue = 'request_queue';
var responseQueue = null;
var offlinePubQueue = [];

function startPublisher() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) {
      return;
    }
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      if (closeOnErr(err)) {
        return;
      }

      pubChannel = ch;

      responseQueue = q.queue;

      ch.prefetch(10);

      ch.consume(responseQueue, processMsg, {noAck: true});

      while (true) {
        var m = offlinePubQueue.shift();
        if (!m) {
          break;
        }
        publish(m[0], m[1], m[2]);
      }
    });
  });
}

function publish(content) {
  if(pubChannel == null || responseQueue == null){
    console.error("[AMQP] publish", "channel is not ready.");
    offlinePubQueue.push([content]);
    return;
  }

  var corr = generateCorrelationId();

  try {
    pubChannel.sendToQueue(requestQueue, content, {
          persistent: true,
          correlationId: corr,
          replyTo: responseQueue
        },
        function(err, ok) {
          if (err) {
            console.error("[AMQP] publish", err);
            offlinePubQueue.push([content]);
            pubChannel.connection.close();
          } else {
            console.log("success publish message, correlationId: ", corr);
          }
        }
    );
  } catch (e) {                                                                                                                               
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([content]);
  }
}

function processMsg(msg) {
  console.log(" Got return msg ", msg.content.toString(), msg.properties.correlationId);

  var data = JSON.parse(msg.content);

  dataAccess.insert(data.posList, data.level, data.type, data.value);
}

function closeOnErr(err) {
  if (!err) {
    return false;
  }
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

function generateCorrelationId() {
  return uuid.v4();
}

start();

exports.publish = publish;
