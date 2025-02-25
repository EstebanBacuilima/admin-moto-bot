FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
 
COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/angular-moto-bot/browser /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]