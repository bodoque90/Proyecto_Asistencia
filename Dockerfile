# Imagen base compatible con Windows Server 2016
FROM mcr.microsoft.com/windows/servercore:ltsc2016

# Instalar Node.js (versión LTS recomendada para Windows Server 2016)
# Descarga e instala Node.js 18.x (compatible con Windows Server 2016)
SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]
RUN Invoke-WebRequest -Uri https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi -OutFile node.msi; \
    Start-Process msiexec.exe -ArgumentList '/i', 'node.msi', '/quiet', '/norestart' -Wait; \
    Remove-Item -Force node.msi

# Establece el directorio de trabajo
WORKDIR C:\\app

# Copia package.json y package-lock.json (si existe) e instala dependencias
COPY package*.json ./
RUN npm ci --only=production; if ($LASTEXITCODE -ne 0) { npm install --production }

# Copia el resto del código
COPY . .

# Expone el puerto que usa la app
EXPOSE 3000

# Usa variables de entorno por seguridad
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "main.js"]
