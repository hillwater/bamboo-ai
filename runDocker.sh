#!/bin/bash
. ./buildDocker.sh

docker stop gomoku-web3
docker rm gomoku-web3

HOST=172.17.0.1
docker run -d -e REDIS_HOST=$HOST  -p 80:3000 --name gomoku-web3 hillwater/gomoku-web:3.0.0
