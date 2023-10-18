#!/bin/bash

docker stop gomoku-web2
docker rm gomoku-web2

HOST=172.17.0.1
docker run -d  -e CLOUDAMQP_URL=amqp://hillwater:hillwater@$HOST:5672/gomoku -e REDIS_HOST=$HOST  -p 80:3000 --name gomoku-web2 hillwater/gomoku-web:1.1.0