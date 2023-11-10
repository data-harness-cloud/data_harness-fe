FROM reg.aidb.site/library/node:18.18.2-dev as builder
WORKDIR /app
COPY ../../../* /app/
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install && \
    npm build:prod

FROM reg.aidb.site/library/nginx:v1
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf