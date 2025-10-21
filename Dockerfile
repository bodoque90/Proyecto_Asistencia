# Imagen base Linux (ligera y rápida)
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --production

# Copiar el código de la aplicación
COPY . .

# Puerto de la aplicación
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production

# Comando para iniciar
CMD ["node", "main.js"]