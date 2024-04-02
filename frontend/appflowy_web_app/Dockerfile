FROM node:latest

RUN apt-get update && \
    apt-get install -y nginx

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

ARG SSL_CERTIFICATE
ARG SSL_PRIVATE_KEY

RUN echo "$SSL_CERTIFICATE" > /etc/ssl/certs/nginx-signed.crt
RUN echo "$SSL_PRIVATE_KEY" > /etc/ssl/private/nginx-signed.key

COPY dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 31302 31303

CMD ["nginx", "-g", "daemon off;"]
