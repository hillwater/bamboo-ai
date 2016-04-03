/**
 * Created by ubuntu on 3/19/16.
 */
var redis = require("redis");
var Promise = require('bluebird');
var utils = require('./utils');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);


var port = process.env.REDIS_PORT || 6379;
var host = process.env.REDIS_HOST || 'localhost';
var password = process.env.REDIS_PASSWORD || '';

// for debug
//redis.debug_mode = true;

var client = redis.createClient(port, host);
client.auth(password);

client.on("error", function (err) {
    console.error(err);
});

function RedisDao() {
    this.find = function(posList, level, type) {
        return client.hgetAsync(utils.posList2Key(posList), utils.combineTypeLevel(type, level));
    };

    this.insert = function(posList, level, type, value) {
        return client.hsetAsync(utils.posList2Key(posList), utils.combineTypeLevel(type, level), value)
            .then(function(){
                console.log("success to insert into redis posList: %s, level: %s, type: %s, value: %s",
                    posList, level, type, value);
                return true;
            });
    };
}

module.exports = RedisDao;
