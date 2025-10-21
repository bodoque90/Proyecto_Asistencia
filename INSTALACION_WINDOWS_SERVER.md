# Guía de Instalación en Windows Server 2016

## Requisitos Previos
- Windows Server 2016 (actualizado con los últimos parches)
- Conexión a Internet
- Acceso de Administrador

---

## OPCIÓN 1: Instalación SIN Docker (MÁS SIMPLE Y RECOMENDADO)

### Paso 1: Instalar Node.js

1. Descarga Node.js 18 LTS desde PowerShell como Administrador:
```powershell
# Descargar Node.js 18
$nodeUrl = "https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi"
$nodePath = "$env:TEMP\node-installer.msi"
Invoke-WebRequest -Uri $nodeUrl -OutFile $nodePath

# Instalar
Start-Process msiexec.exe -ArgumentList "/i", $nodePath, "/quiet", "/norestart" -Wait

# Limpiar
Remove-Item $nodePath

# Verificar instalación
node --version
npm --version
```

### Paso 2: Instalar MySQL

Ejecuta el script que ya tienes:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
.\install-mysql.ps1
```

O instala MySQL manualmente:
1. Descarga MySQL 8.0 desde: https://dev.mysql.com/downloads/mysql/
2. Instala como servicio de Windows
3. Configura con contraseña: `example_password`
4. Crea la base de datos: `asistencia_db`

### Paso 3: Configurar Firewall

```powershell
# Abrir puerto 3306 para MySQL
New-NetFirewallRule -DisplayName "MySQL" -Direction Inbound -Protocol TCP -LocalPort 3306 -Action Allow

# Abrir puerto 3000 para la aplicación
New-NetFirewallRule -DisplayName "App Node" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

### Paso 4: Desplegar la Aplicación

```powershell
# Ir a la carpeta del proyecto
cd C:\ruta\a\tu\proyecto

# Instalar dependencias
npm install

# Configurar variables de entorno (crear archivo .env)
@"
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=example_password
DB_NAME=asistencia_db
NODE_ENV=production
"@ | Out-File -FilePath .env -Encoding utf8

# Probar la aplicación
node main.js
```

### Paso 5: Ejecutar como Servicio de Windows (Opcional)

Instala PM2 para ejecutar la app como servicio:
```powershell
# Instalar PM2 globalmente
npm install -g pm2
npm install -g pm2-windows-startup

# Configurar PM2 para iniciar con Windows
pm2-startup install

# Iniciar la aplicación
cd C:\ruta\a\tu\proyecto
pm2 start main.js --name "asistencia-app"

# Guardar configuración
pm2 save
```

### Paso 6: Acceder a la Aplicación

Abre el navegador en: **http://localhost:3000**
O desde otra máquina: **http://IP_DEL_SERVIDOR:3000**

---

## OPCIÓN 2: Instalación CON Docker en Windows Server 2016

### Paso 1: Habilitar Containers

Abre PowerShell como Administrador:
```powershell
# Instalar la característica Containers
Install-WindowsFeature -Name Containers -Restart

# Después del reinicio, continúa con el Paso 2
```

### Paso 2: Instalar Docker Enterprise Edition

```powershell
# Descargar e instalar Docker EE
Invoke-WebRequest -UseBasicParsing "https://download.docker.com/components/engine/windows-server/index.json" | ConvertFrom-Json | Select-Object -ExpandProperty channels | Select-Object -ExpandProperty stable | Select-Object -ExpandProperty url -First 1 | ForEach-Object {
    Invoke-WebRequest -UseBasicParsing -OutFile "$env:TEMP\docker.zip" -Uri $_
}

# Extraer Docker
Expand-Archive -Path "$env:TEMP\docker.zip" -DestinationPath $env:ProgramFiles -Force

# Agregar Docker al PATH
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:ProgramFiles\docker", [EnvironmentTargetMachine])

# Registrar Docker como servicio
& "$env:ProgramFiles\docker\dockerd.exe" --register-service

# Iniciar servicio Docker
Start-Service docker

# Verificar instalación
docker version
```

### Paso 3: Configurar Docker para Linux Containers

**IMPORTANTE**: Windows Server 2016 solo soporta Windows Containers nativamente. Para Linux Containers necesitas:

#### Opción A: Actualizar a Windows Server 2019/2022
Windows Server 2019+ incluye soporte para LCOW (Linux Containers on Windows)

#### Opción B: Usar solo instalación nativa (RECOMENDADO)
Sigue la **OPCIÓN 1** arriba (sin Docker) - es más simple y confiable para WS2016

### Paso 4: Si decides usar Windows Containers (avanzado)

Necesitarás modificar el proyecto para usar imágenes base Windows. Usa el archivo `docker-compose.hybrid.yml` que ya tienes preparado.

---

## SOLUCIÓN RECOMENDADA FINAL

Para **Windows Server 2016**, te recomiendo:

### Arquitectura híbrida:
1. **MySQL en el servidor** (sin contenedor) - usa `install-mysql.ps1`
2. **App Node.js en el servidor** (sin contenedor) - instalación directa
3. **PM2** para gestionar la aplicación como servicio

### ¿Por qué esta opción?
✅ Funciona 100% en Windows Server 2016
✅ Sin complicaciones de versiones de Docker
✅ Más fácil de mantener y depurar
✅ Mejor rendimiento (sin overhead de contenedores)
✅ Usa los mismos scripts que ya tienes

---

## Script de Instalación Automática

He creado un script que hace todo automáticamente. Ver: `setup-windows-server.ps1`

Ejecuta:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
.\setup-windows-server.ps1
```

---

## Resolución de Problemas

### Error: MySQL no conecta
```powershell
# Verificar que MySQL está corriendo
Get-Service MySQL
Start-Service MySQL

# Verificar puerto
netstat -an | findstr 3306
```

### Error: No se puede acceder a la aplicación
```powershell
# Verificar firewall
Get-NetFirewallRule -DisplayName "App Node"

# Verificar que la app está corriendo
netstat -an | findstr 3000
```

### Logs de la aplicación
```powershell
# Si usas PM2
pm2 logs asistencia-app

# Si ejecutas directo
# Los logs aparecen en la consola donde ejecutaste node main.js
```

---

## Próximos Pasos

1. Ejecuta el script `setup-windows-server.ps1`
2. Verifica que MySQL está corriendo
3. Verifica que la app está corriendo
4. Abre http://localhost:3000 en el navegador
5. Configura PM2 para que inicie automáticamente

¿Necesitas ayuda con algún paso? Consulta la sección de resolución de problemas.
