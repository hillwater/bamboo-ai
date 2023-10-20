#!/bin/bash

# copy from redis container to host
docker cp redis:/data/dump.rdb .

# save to aliyun OSS
currentDay=`date '+%F'`
ossutil cp -f dump.rdb oss://gomoku2/redis-backup/$currentDay/
