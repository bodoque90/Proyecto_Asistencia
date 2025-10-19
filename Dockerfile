# Imagen base
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json (si existe) e instala dependencias
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# Copia el resto del código
COPY . .

# Expone el puerto que usa la app
EXPOSE 3000

# Usa variables de entorno por seguridad
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "main.js"]
