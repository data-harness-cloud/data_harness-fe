#!/bin/bash

docker build -t sdt_fe:v1 . 
docker volume create --name sdt_fe_data
docker network create sdt_net
docker run -d \
--name sdt_fe \
--restart unless-stopped \
--network sdt_net \
-p 80:80 \
-v sdt_fe_data:/var/www/html \
-e TZ=Asia/Shanghai \
-e SDT_BE_URL={{}} \
-e OPENAI_API_URL={{}} \
-e OPENAI_API_KEY={{}} \
--health-cmd "curl -f http://localhost" \
--health-interval 10s \
--health-timeout 5s \
--health-retries 5 \
sdt_fe:v1