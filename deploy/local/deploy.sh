www-data-path=

npm config set registry https://registry.npm.taobao.org
cd ../.. && npm install && npm build:prod

cp -av ../../dist/* $www-data-path