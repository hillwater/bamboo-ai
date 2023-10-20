var RedisDao = require('./Dao/redisConnector');
var redisDao = new RedisDao();

redisDao.clearAllMask().then(() => {
    console.log("all finished");
    process.exit();
})