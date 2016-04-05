# bamboo-ai

a nodejs web project of Gomoku AI.

## install

````sh
sudo npm install bower -g
sudo npm install forever -g
npm install
bower install
````

## how to run
````sh
export CLOUDAMQP_URL=amqp://localhost
export MONGODB_URL=mongodb://localhost/gomoku
export REDIS_HOST=localhost
export REDIS_PASSWORD=
./runAp.sh
````
then you can access to http://localhost:3000
