# Paso 1: Construcción
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod
# Paso 2: Servidor web
FROM nginx:alpine
# Copia los archivos de la aplicación Angular al directorio de Nginx
COPY --from=build /app/dist/angular-moto-bot/browser /usr/share/nginx/html
# Copia el archivo de configuración de Nginx personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]