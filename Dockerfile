# ---------------------------------------------------
# 1. docker build -t "cpu:dev" -f Dockerfile .
# 2. docker run -v $(pwd):/cpu-monitor-server --name test --env-file ./.env -p 8090:8090 -p 9229:9229 -it cpu:dev
# where -> /Users/stanislavkapranov/Desktop/cpu-monitor/cpu-monitor-server
# You can get envFile.env from development team

# ---------------------------------------------------

FROM alpine:latest

# ---------------------------------------------------

RUN apk update
RUN apk upgrade
RUN apk add --no-cache nodejs nodejs-npm python make g++ gcc libpq git libgit2-dev tzdata pkgconfig build-base redis

# ---------------------------------------------------
RUN mkdir /cpu-monitor-server
RUN cd /cpu-monitor-server
WORKDIR /cpu-monitor-server

# --------------------------------------------------- 

ENTRYPOINT npm install && redis-server --daemonize yes && npm run start

# ------------------------------------------

EXPOSE 8090 9229