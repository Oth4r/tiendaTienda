FROM nginx:stable-alpine
COPY dist/tienda/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]