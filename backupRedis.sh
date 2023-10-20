#!/bin/bash

# copy from redis container to host
docker cp redis:/data/dump.rdb /tmp/

# save to aliyun OSS
currentDay=`date '+%F'`
ossutil cp -f /tmp/dump.rdb oss://gomoku2/redis-backup/$currentDay/
echo "backup redis done: $currentDay"
