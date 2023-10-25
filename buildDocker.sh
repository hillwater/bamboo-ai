#!/bin/bash

IMAGE=hillwater/gomoku-web:3.0.0

docker build -t $IMAGE .

docker push $IMAGE 
