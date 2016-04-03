/**
 * Created by ubuntu on 3/19/16.
 */
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var Promise = require('bluebird');
var utils = require('./utils');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;

var gomokuCollection = 'gomoku_result';

function MongodbDao() {
    this.find = function (posList, level, type) {
        return MongoClient.connectAsync(process.env.MONGODB_URL).then(function (db) {
            console.log("Connected correctly to server.");
            return db.collection(gomokuCollection).findOneAsync({
                posList: utils.posList2HexKey(posList),
                level: level,
                type: type
            }, {value: 1, _id: 0});
        });
    };

    this.insertOrUpdate = function (posList, level, type, value) {
        return MongoClient.connectAsync(process.env.MONGODB_URL).then(function (db) {
            console.log("Connected correctly to server.");
            return db.collection(gomokuCollection)
                .findOneAsync({
                    posList: utils.posList2HexKey(posList),
                    level: level, type: type
                }, {value: 1, _id: 0})
                .then(function (data) {
                    if (data == null) { // if not find
                        return db.collection(gomokuCollection).insertOneAsync({
                            posList: utils.posList2HexKey(posList),
                            level: level, type: type, value: value
                        }).then(function(){
                            console.log("success to insert into mongodb posList: %s, " +
                                "level: %s, type: %s, value: %s",
                                posList, level, type, value);
                            return true;
                        });
                    } else {
                        return db.collection(gomokuCollection).updateOneAsync({
                            posList: utils.posList2HexKey(posList),
                            level: level, type: type
                        }, {$set:{value:value}}).then(function(){
                            console.log("success to update mongodb posList: %s, " +
                                "level: %s, type: %s, value: %s",
                                posList, level, type, value);
                            return true;
                        });
                    }
                });
        });
    }
}

module.exports = MongodbDao;
