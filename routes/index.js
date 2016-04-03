var express = require('express');
var router = express.Router();
var amqpConnector = require('../Dao/amqpConnector');
var dataAccess = require('../Dao/dataAccess');
var Promise = require("bluebird");

var mask = 0x5a00;

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index');
});

router.post('/compute', function(req, res, next) {

  var posList = convertStringArrayToIntArray(req.body['posList[]']);
  var level = parseInt(req.body.level);
  var type = parseInt(req.body.type);
  var useMultiCore = false;
  var useMultiMachine = false;
  var machineCount = 0;

  dataAccess.find(posList, level, type).then(function(data){
    if(data == null) {

      // insert mask to represent in calculation
      dataAccess.insert(posList, level, type, mask);

      var msg = {
        posList:posList,
        level:level,
        useMultiCore:useMultiCore,
        useMultiMachine:useMultiMachine,
        machineCount:machineCount,
        type:type
      };

      amqpConnector.publish(new Buffer(JSON.stringify(msg)));

      return mask;
    }else {
      return data;
    }
  }).then(function(data){
    res.json(data);
  }).catch(function(err) {
    throw err;
  });


  function convertStringArrayToIntArray(strArray) {
    var result = [];
    for(var i = 0; i<strArray.length;i++) {
      result.push(parseInt(strArray[i]));
    }
    return result;
  }

});

module.exports = router;
