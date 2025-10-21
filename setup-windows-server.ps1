# Script de Instalación Automática para Windows Server 2016
# Ejecutar como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalación Proyecto Asistencia" -ForegroundColor Cyan
Write-Host "  Windows Server 2016" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar privilegios de administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    exit 1
}

# Variables de configuración
$MYSQL_PASSWORD = "example_password"
$DB_NAME = "asistencia_db"
$APP_PORT = 3000

# Función para verificar si un comando existe
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) { return $true }
    } catch { return $false }
}

# Paso 1: Instalar Node.js
Write-Host "`n[1/6] Instalando Node.js 18 LTS..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "  Node.js ya está instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  Descargando Node.js..." -ForegroundColor Gray
    $nodeUrl = "https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi"
    $nodePath = "$env:TEMP\node-installer.msi"
    
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodePath -UseBasicParsing
        Write-Host "  Instalando Node.js (esto puede tardar unos minutos)..." -ForegroundColor Gray
        Start-Process msiexec.exe -ArgumentList "/i", $nodePath, "/quiet", "/norestart" -Wait
        Remove-Item $nodePath -Force
        
        # Actualizar PATH en la sesión actual
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host "  ✓ Node.js instalado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: No se pudo instalar Node.js" -ForegroundColor Red
        Write-Host "  Descarga manual desde: https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
}

# Paso 2: Instalar MySQL
Write-Host "`n[2/6] Instalando MySQL 8.0..." -ForegroundColor Yellow

# Verificar si MySQL ya está instalado
$mysqlService = Get-Service -Name "MySQL" -ErrorAction SilentlyContinue
if ($mysqlService) {
    Write-Host "  MySQL ya está instalado" -ForegroundColor Green
    if ($mysqlService.Status -ne "Running") {
        Write-Host "  Iniciando servicio MySQL..." -ForegroundColor Gray
        Start-Service MySQL
    }
} else {
    Write-Host "  Descargando MySQL..." -ForegroundColor Gray
    $mysqlVersion = "8.0.40"
    $mysqlUrl = "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-$mysqlVersion-winx64.zip"
    $mysqlZip = "$env:TEMP\mysql.zip"
    $mysqlPath = "C:\MySQL"
    
    try {
        Invoke-WebRequest -Uri $mysqlUrl -OutFile $mysqlZip -UseBasicParsing
        
        Write-Host "  Extrayendo MySQL..." -ForegroundColor Gray
        Expand-Archive -Path $mysqlZip -DestinationPath $mysqlPath -Force
        
        $mysqlDir = Get-ChildItem -Path $mysqlPath -Directory | Select-Object -First 1
        $mysqlBin = Join-Path $mysqlDir.FullName "bin"
        
        Write-Host "  Inicializando MySQL..." -ForegroundColor Gray
        & "$mysqlBin\mysqld.exe" --initialize-insecure --console
        
        Write-Host "  Instalando servicio MySQL..." -ForegroundColor Gray
        & "$mysqlBin\mysqld.exe" --install MySQL
        
        Write-Host "  Iniciando servicio MySQL..." -ForegroundColor Gray
        Start-Service MySQL
        
        Start-Sleep -Seconds 5
        
        Write-Host "  Configurando MySQL..." -ForegroundColor Gray
        $sqlCommands = @"
ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';
CREATE DATABASE IF NOT EXISTS $DB_NAME;
FLUSH PRIVILEGES;
"@
        $sqlCommands | & "$mysqlBin\mysql.exe" -u root --skip-password
        
        # Agregar MySQL al PATH
        [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$mysqlBin", [EnvironmentTargetMachine])
        
        Remove-Item $mysqlZip -Force
        Write-Host "  ✓ MySQL instalado y configurado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: No se pudo instalar MySQL automáticamente" -ForegroundColor Red
        Write-Host "  Descarga manual desde: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
        Write-Host "  O ejecuta: .\install-mysql.ps1" -ForegroundColor Yellow
    }
}

# Paso 3: Configurar Firewall
Write-Host "`n[3/6] Configurando Firewall..." -ForegroundColor Yellow

$firewallRules = @(
    @{Name="MySQL"; Port=3306},
    @{Name="App Node"; Port=$APP_PORT}
)

foreach ($rule in $firewallRules) {
    $existingRule = Get-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue
    if (-not $existingRule) {
        Write-Host "  Abriendo puerto $($rule.Port) ($($rule.Name))..." -ForegroundColor Gray
        New-NetFirewallRule -DisplayName $rule.Name -Direction Inbound -Protocol TCP -LocalPort $rule.Port -Action Allow | Out-Null
    } else {
        Write-Host "  Puerto $($rule.Port) ya está abierto" -ForegroundColor Green
    }
}
Write-Host "  ✓ Firewall configurado" -ForegroundColor Green

# Paso 4: Instalar dependencias del proyecto
Write-Host "`n[4/6] Instalando dependencias del proyecto..." -ForegroundColor Yellow

$projectPath = $PSScriptRoot
if (-not (Test-Path "$projectPath\package.json")) {
    Write-Host "  ERROR: No se encuentra package.json en $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath
Write-Host "  Ejecutando npm install..." -ForegroundColor Gray

try {
    npm install --production 2>&1 | Out-Null
    Write-Host "  ✓ Dependencias instaladas" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: No se pudieron instalar las dependencias" -ForegroundColor Red
    exit 1
}

# Paso 5: Crear archivo de configuración
Write-Host "`n[5/6] Creando configuración..." -ForegroundColor Yellow

$envContent = @"
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=$MYSQL_PASSWORD
DB_NAME=$DB_NAME
NODE_ENV=production
"@

$envContent | Out-File -FilePath "$projectPath\.env" -Encoding utf8 -Force
Write-Host "  ✓ Archivo .env creado" -ForegroundColor Green

# Paso 6: Configurar como servicio (opcional con PM2)
Write-Host "`n[6/6] Configurando servicio automático (PM2)..." -ForegroundColor Yellow

if (Test-Command "pm2") {
    Write-Host "  PM2 ya está instalado" -ForegroundColor Green
} else {
    Write-Host "  Instalando PM2..." -ForegroundColor Gray
    try {
        npm install -g pm2 pm2-windows-startup 2>&1 | Out-Null
        Write-Host "  ✓ PM2 instalado" -ForegroundColor Green
    } catch {
        Write-Host "  ADVERTENCIA: No se pudo instalar PM2" -ForegroundColor Yellow
        Write-Host "  La aplicación deberá iniciarse manualmente" -ForegroundColor Yellow
    }
}

if (Test-Command "pm2") {
    Write-Host "  Configurando inicio automático..." -ForegroundColor Gray
    try {
        pm2-startup install 2>&1 | Out-Null
        pm2 delete asistencia-app 2>&1 | Out-Null
        pm2 start "$projectPath\main.js" --name asistencia-app 2>&1 | Out-Null
        pm2 save 2>&1 | Out-Null
        Write-Host "  ✓ Aplicación configurada para inicio automático" -ForegroundColor Green
    } catch {
        Write-Host "  ADVERTENCIA: No se pudo configurar inicio automático" -ForegroundColor Yellow
    }
}

# Resumen final
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Información de la instalación:" -ForegroundColor White
Write-Host "  • Base de datos: MySQL 8.0" -ForegroundColor Gray
Write-Host "    - Host: localhost" -ForegroundColor Gray
Write-Host "    - Puerto: 3306" -ForegroundColor Gray
Write-Host "    - Usuario: root" -ForegroundColor Gray
Write-Host "    - Contraseña: $MYSQL_PASSWORD" -ForegroundColor Gray
Write-Host "    - Base de datos: $DB_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "  • Aplicación: Node.js" -ForegroundColor Gray
Write-Host "    - Puerto: $APP_PORT" -ForegroundColor Gray
Write-Host "    - URL local: http://localhost:$APP_PORT" -ForegroundColor Cyan
Write-Host "    - Carpeta: $projectPath" -ForegroundColor Gray
Write-Host ""

if (Test-Command "pm2") {
    Write-Host "Comandos útiles de PM2:" -ForegroundColor White
    Write-Host "  pm2 status              # Ver estado de la aplicación" -ForegroundColor Gray
    Write-Host "  pm2 logs asistencia-app # Ver logs en tiempo real" -ForegroundColor Gray
    Write-Host "  pm2 restart asistencia-app # Reiniciar aplicación" -ForegroundColor Gray
    Write-Host "  pm2 stop asistencia-app # Detener aplicación" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Estado actual de PM2:" -ForegroundColor White
    pm2 status
} else {
    Write-Host "Para iniciar la aplicación manualmente:" -ForegroundColor White
    Write-Host "  cd $projectPath" -ForegroundColor Gray
    Write-Host "  node main.js" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "¡La instalación ha finalizado!" -ForegroundColor Green
Write-Host "Abre http://localhost:$APP_PORT en tu navegador" -ForegroundColor Cyan
Write-Host ""
