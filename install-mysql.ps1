# Script para instalar y configurar MySQL en Windows Server 2016
# Ejecutar como Administrador

Write-Host "=== Instalación de MySQL para Windows Server 2016 ===" -ForegroundColor Green

# 1. Descargar MySQL
$mysqlVersion = "8.0.40"
$downloadUrl = "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-$mysqlVersion-winx64.zip"
$downloadPath = "$env:TEMP\mysql.zip"
$installPath = "C:\MySQL"

Write-Host "Descargando MySQL $mysqlVersion..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath

# 2. Extraer archivos
Write-Host "Extrayendo archivos..." -ForegroundColor Yellow
Expand-Archive -Path $downloadPath -DestinationPath $installPath -Force

# 3. Configurar MySQL
$mysqlDir = Get-ChildItem -Path $installPath -Directory | Select-Object -First 1
$mysqlBin = Join-Path $mysqlDir.FullName "bin"

Write-Host "Inicializando MySQL..." -ForegroundColor Yellow
& "$mysqlBin\mysqld.exe" --initialize-insecure --console

# 4. Instalar como servicio
Write-Host "Instalando MySQL como servicio..." -ForegroundColor Yellow
& "$mysqlBin\mysqld.exe" --install MySQL --defaults-file="$($mysqlDir.FullName)\my.ini"

# 5. Iniciar servicio
Write-Host "Iniciando servicio MySQL..." -ForegroundColor Yellow
Start-Service MySQL

# 6. Configurar base de datos
Write-Host "Configurando base de datos..." -ForegroundColor Yellow
$sqlCommands = @"
ALTER USER 'root'@'localhost' IDENTIFIED BY 'example_password';
CREATE DATABASE IF NOT EXISTS asistencia_db;
FLUSH PRIVILEGES;
"@

$sqlCommands | & "$mysqlBin\mysql.exe" -u root

Write-Host "=== Instalación completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para conectarte a MySQL:" -ForegroundColor Cyan
Write-Host "  Usuario: root" -ForegroundColor White
Write-Host "  Contraseña: example_password" -ForegroundColor White
Write-Host "  Base de datos: asistencia_db" -ForegroundColor White
Write-Host ""
Write-Host "Ahora puedes ejecutar: docker-compose up --build" -ForegroundColor Cyan

# Limpiar
Remove-Item $downloadPath -Force
