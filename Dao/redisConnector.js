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

var mask = 0x5a00;

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

    this.findMaxLevel = function(posList, minLevel, type) {
        return client.hgetallAsync(utils.posList2Key(posList)).then(function(levelMap) {
            console.log("redis findMaxLevel,posList:"+posList+",minLevel:"+minLevel+",type:"+type+",levelMap:"+JSON.stringify(levelMap))
            if(!levelMap) {
                console.log("redis findMaxLevel,postList:"+posList+" has no data")
                return null;
            }

            var maxLevel = -1;
            var pos;
            for(var typeLevel in levelMap) {
                var obj = utils.extractLevel(typeLevel);

                if(obj.type != type) {
                    continue;
                }

                if(maxLevel<obj.level) {
                    maxLevel = obj.level;
                    pos = levelMap[typeLevel];
                }
            }
            console.log("redis findMaxLevel, posList:"+posList+",minLevel:"+minLevel+",type:"+type+" maxLevel:"+maxLevel+",pos:"+pos);

            if(maxLevel == -1 || maxLevel < minLevel) {
                return null;
            }
            
            return {
                level: maxLevel,
                pos: pos
            };
        });
    };

    this.insert = function(posList, level, type, value) {
        return client.hsetAsync(utils.posList2Key(posList), utils.combineTypeLevel(type, level), value)
            .then(function(){
                console.log("success to insert into redis posList: %s, level: %s, type: %s, value: %s",
                    posList, level, type, value);
                return true;
            });
    };

    this.clearAllMask = function() {
        return client.keysAsync("*").then(async allKeys=>{
            console.log("clearAllMask, size:"+allKeys.length);

            for(let i =0;i<allKeys.length;i++) {
                let key = allKeys[i];
                let levelMap = await client.hgetallAsync(key);
                if(!levelMap) {
                    continue;
                }
                console.log("check mask, posList:"+utils.key2PosList(key)+",levelMap:"+JSON.stringify(levelMap));

                for(let levelType in levelMap) {
                    if(levelMap[levelType] == mask) {
                        // need to clear
                        client.hrem(key, levelType);
                        console.log("clear mask, posList:"+utils.key2PosList(key)+",levelType:"+levelType+",levelMap:"+JSON.stringify(levelMap));
                    }
                }
            }
        });
    }
}

module.exports = RedisDao;
