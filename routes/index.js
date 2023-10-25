var express = require('express');
var router = express.Router();
var dataAccess = require('../Dao/dataAccess');
var Promise = require("bluebird");

var mask = 0x5a00;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET custom page. */
router.get('/custom', function(req, res, next) {
  res.render('custom');
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

      dataAccess.addToList("requestQueue", msg);

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
    // fix a bug, when only one element, the input is not an array, but just a string.
    if(!Array.isArray(strArray)) {
        result.push(parseInt(strArray));
    }else {
      for(var i = 0; i<strArray.length;i++) {
        result.push(parseInt(strArray[i]));
      }
    }

    return result;
  }

});

module.exports = router;
