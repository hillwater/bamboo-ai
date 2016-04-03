var express = require('express');
var router = express.Router();
var amqpConnector = require('../Dao/amqpConnector');
var MongodbDao = require('../Dao/mongodbConnector');
var RedisDao = require('../Dao/redisConnector');
var dataAccess = require('../Dao/dataAccess');
var Promise = require("bluebird");

router.get('/', function(req, res, next) {

    var result = '';

    res.render('test', { title: 'Express' });
});

router.get('/mqtest', function(req, res, next) {

    var result = 'hello world';

    var posList = [119, 103, 136, 102, 104, 134, 120, 152, 118];
    var level = 1;
    var useMultiCore = false;
    var useMultiMachine = false;
    var machineCount = 0;
    var type = 0;

    var data = {
        posList:posList,
        level:level,
        useMultiCore:useMultiCore,
        useMultiMachine:useMultiMachine,
        machineCount:machineCount,
        type:type
    };

    amqpConnector.publish(new Buffer(JSON.stringify(data)));

    res.json({ result: result });
    res.end();
});

router.get('/dbtest', function(req, res, next) {

    var mongodbDao = new MongodbDao();

    var posList = [];
    for(var i = 0; i< 50;i++) {
        posList.push(i);
    }
    var level = 1;
    var type = 0;
    var value = 200;

    mongodbDao.insertOrSkip(posList, level, type, value).then(function() {
        //Promise.resolve().then(function(){
        return mongodbDao.find(posList, level, type);
    }).then(function(data){
        res.json(data.value);
    }).catch(function(err) {
        throw err;
    });
});

router.get('/redistest', function(req, res, next) {

    var redisDao = new RedisDao();

    var posList = [];
    for(var i = 0; i< 100;i++) {
        posList.push(i);
    }
    var level = 1;
    var type = 0;
    var value = 300;

    redisDao.insert(posList, level, type, value).then(function() {
        return redisDao.find(posList, level, type);
    }).then(function(data){
        res.json(data);
    }).catch(function(err) {
        throw err;
    });
});

router.get('/data-access-test', function(req, res, next) {

    var posList = [];
    for(var i = 0; i< 40;i++) {
        posList.push(i);
    }
    var level = 1;
    var type = 0;
    var value = 400;

    dataAccess.insert(posList, level, type, value).then(function() {
        return dataAccess.find(posList, level, type);
    }).then(function(data){
        res.json(data);
    }).catch(function(err) {
        throw err;
    });
});

router.get('/gomoku-test', function(req, res, next) {
    var posList = [119, 103, 136, 102, 104, 134, 120, 152, 118];
    var level = 2;
    var useMultiCore = false;
    var useMultiMachine = false;
    var machineCount = 0;
    var type = 0;


    dataAccess.find(posList, level, type).then(function(data){
        if(data == null) {
            var msg = {
                posList:posList,
                level:level,
                useMultiCore:useMultiCore,
                useMultiMachine:useMultiMachine,
                machineCount:machineCount,
                type:type
            };

            amqpConnector.publish(new Buffer(JSON.stringify(msg)));

            return null;
        }else {
            return data;
        }
    }).then(function(data){
        res.json(data);
    }).catch(function(err) {
        throw err;
    });
});

module.exports = router;
