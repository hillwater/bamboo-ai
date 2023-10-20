var RedisDao = require('./redisConnector');
var redisDao = new RedisDao();

redisDao.clearAllMask().then(() => {
    console.log("all finished");
    process.exit();
})