user  root;
worker_processes  2;
error_log  /var/log/nginx/error.log warn;
pid  /var/run/nginx.pid;
events {
  worker_connections  1024;
}
http {
  server_tokens  off;
  include        /etc/nginx/mime.types;
  default_type   application/octet-stream;
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
  proxy_buffer_size       128k;
  proxy_buffers           32 32k;
  proxy_busy_buffers_size 128k;
  access_log              /var/log/nginx/access.log  main;
  sendfile                on;
  keepalive_timeout       65;
  root                    /root/app;
  include /etc/nginx/user.conf.d/*.conf;
  
  upstream gateway {
    server ${GATEWAY_HOST}:${GATEWAY_PORT};
  }

  server {
    listen                8080;
    server_name           localhost;
    client_max_body_size  9999999m;
    client_header_timeout 99999999999s;
    keepalive_timeout     999999999s;
    proxy_read_timeout    180s;
    access_log            /var/log/nginx/access.log  main;
    add_header "X-XSS-Protection" "1; mode=block";
    add_header X-Frame-Options SAMEORIGIN;
    add_header Content-Security-Policy "font-src http:;";

    location = / {
      index index.html;
      root /root/app;
    }
    location = /index.html {
      root /root/app;
    }
    location = /favicon.ico {
      root /root/app;
    }
    location ^~ /manual/ {
      index index.html;
      alias /root/wecube-docs/;
    }
    location ^~ /css/ {
      alias /root/app/css/;
    }
    location ^~ /fonts/ {
      alias /root/app/fonts/;
    }
    location ^~ /img/ {
      alias /root/app/img/;
    }
    location ^~ /js/ {
      alias /root/app/js/;
    }
    location / {
      proxy_set_header Host ${PUBLIC_DOMAIN};
      proxy_pass http://gateway;
    }

  }
}

