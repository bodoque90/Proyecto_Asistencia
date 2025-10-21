# Guía Rápida de Instalación

## Para Windows Server 2016

### Opción Más Simple (RECOMENDADA)

Ejecuta este único comando en PowerShell como Administrador:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
.\setup-windows-server.ps1
```

**¡Eso es todo!** El script hará:
- ✅ Instalar Node.js 18
- ✅ Instalar y configurar MySQL 8.0
- ✅ Configurar el firewall
- ✅ Instalar dependencias del proyecto
- ✅ Configurar la aplicación como servicio
- ✅ Iniciar todo automáticamente

### Después de la instalación

Abre tu navegador en: **http://localhost:3000**

### Comandos útiles

```powershell
# Ver estado de la aplicación
pm2 status

# Ver logs
pm2 logs asistencia-app

# Reiniciar
pm2 restart asistencia-app

# Detener
pm2 stop asistencia-app
```

---

## Para desarrollo local (Docker)

Si estás en tu PC con Docker Desktop (Linux containers):

```bash
docker compose build
docker compose up -d
```

Abre: **http://localhost:3001**

---

## ¿Problemas?

Lee el archivo `INSTALACION_WINDOWS_SERVER.md` para detalles completos y resolución de problemas.

### Errores comunes

**Error: MySQL no conecta**
```powershell
Start-Service MySQL
Get-Service MySQL
```

**Error: Puerto ocupado**
```powershell
netstat -an | findstr 3000
# Cierra la aplicación que usa el puerto 3000
```

**Reinstalar todo**
```powershell
.\setup-windows-server.ps1
```

---

## Archivos del proyecto

- `setup-windows-server.ps1` - Instalador automático para Windows Server
- `install-mysql.ps1` - Instalador de MySQL
- `docker-compose.yml` - Para desarrollo con Docker (Linux)
- `docker-compose.hybrid.yml` - Para referencia
- `Dockerfile` - Imagen Docker de la aplicación
- `INSTALACION_WINDOWS_SERVER.md` - Guía detallada completa
