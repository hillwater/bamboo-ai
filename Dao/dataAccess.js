/**
 * Created by ubuntu on 3/27/16.
 */

var RedisDao = require('./redisConnector');
//var MongodbDao = require('./mongodbConnector');
var Promise = require("bluebird");

exports.find = function(posList, level, type) {
    var redisDao = new RedisDao();
//    var mongodbDao = new MongodbDao();

    return redisDao.find(posList, level, type).then(function(redisData){
        if(redisData == null) { // not find in redis
            return null;
//            return mongodbDao.find(posList, level, type).then(function(mongodbData){
//                if(mongodbData == null) { // not find in mongodb
//                    return null;
//                }else { // find in mongodb
//                    // store into redis
//                    redisDao.insert(posList, level, type, mongodbData.value);
//                    return mongodbData.value;
//                }
//            });
        }else { // find in redis
            return redisData;
        }
    });
};

exports.insert = function(posList, level, type, value) {
    var redisDao = new RedisDao();
    // var mongodbDao = new MongodbDao();
//    return Promise.all([redisDao.insert(posList, level, type, value),
//            mongodbDao.insertOrUpdate(posList, level, type, value)]);

    return Promise.all([redisDao.insert(posList, level, type, value)]);
};