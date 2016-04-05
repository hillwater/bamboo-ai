#!/bin/bash

#./bin/www 1> output.log 2>output.log &

forever start ./bin/www.js 1> output.log 2>output.log &
