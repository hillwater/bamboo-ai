#!/bin/bash

IMAGE=hillwater/gomoku-web:1.1.0

docker build -t $IMAGE .

docker push $IMAGE 
