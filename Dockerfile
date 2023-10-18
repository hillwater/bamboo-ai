FROM node:latest

WORKDIR /usr/src/app

COPY ./bin ./bin
COPY ./Dao ./Dao
COPY ./locales ./locales
COPY ./public ./public
COPY ./views ./views
COPY ./routes ./routes
COPY ./app.js .
COPY ./package.json .

apt-get install -y vim

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 3000

CMD ["node", "./bin/www.js"]
