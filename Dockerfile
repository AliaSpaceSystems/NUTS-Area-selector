#FROM nginx:1.17.1-alpine
FROM openresty/openresty:1.19.9.1-5-alpine-fat
#COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#COPY ./dist/openlayers-angular /usr/share/nginx/html
COPY ./dist/openlayers-angular /usr/local/openresty/nginx/html
