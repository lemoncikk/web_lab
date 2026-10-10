FROM nginx:alpine

# Копируем конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем содержимое public/html в корень Nginx
COPY public/html /usr/share/nginx/html

# Копируем css и js в соответствующие папки
COPY public/css /usr/share/nginx/html/css
COPY public/js /usr/share/nginx/html/js

EXPOSE 80