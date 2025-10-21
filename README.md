# Proyecto_Asistencia

Proyecto_Asistencia

Sistema de control de asistencia con Node.js y MySQL.

Dependencias básicas: Node.js, npm.

## Dependencias

Instalación local (opcional):

- Node.js v18+

- MySQL 8.0```powershell

- Docker (para contenedorización en Windows Server 2016)npm install

```

## Instalación local (opcional)

Ejecutar localmente:

```powershell

npm install```powershell

```npm run dev

```

## Ejecutar localmente

Ejecutar con Docker Compose:

```powershell

npm run dev1. Ajusta (si quieres) la contraseña en `docker-compose.yml` (por defecto `example_password`).

```2. Levanta los servicios:



## Ejecutar con Docker en Windows Server 2016```powershell

docker compose up --build

### Opción 1: MySQL como servicio en Windows (Recomendado)```



Esta es la opción más estable para Windows Server 2016.La app quedará en http://localhost:3000 y MySQL en el puerto 3306.



1. **Instalar MySQL en Windows Server 2016:**Notas:

   ```powershell- `config/db.js` lee variables de entorno: DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME.

   # Ejecutar PowerShell como Administrador- En desarrollo el servicio `app` monta el volumen del proyecto para reflejar cambios sin reconstruir la imagen.

   .\install-mysql.ps1
   ```
   
   O descargar manualmente desde: https://dev.mysql.com/downloads/mysql/

2. **Construir y ejecutar el contenedor:**
   ```powershell
   docker-compose up --build
   ```

### Opción 2: Contenedores híbridos (Windows + Linux)

Requiere Docker Desktop con LCOW (Linux Containers on Windows) habilitado.

```powershell
docker-compose -f docker-compose.hybrid.yml up --build
```

## Acceso a la aplicación

- **Aplicación web**: http://localhost:3001
- **MySQL**: Puerto 3306 (localhost) o 3307 (contenedor híbrido)

## Configuración

Las variables de entorno se configuran en `docker-compose.yml`:

- `DB_HOST`: `host.docker.internal` (para MySQL en Windows host) o `db` (para contenedor)
- `DB_PORT`: `3306`
- `DB_USER`: `root`
- `DB_PASS`: `example_password`
- `DB_NAME`: `asistencia_db`
- `NODE_ENV`: `production`

Puedes cambiar estos valores según tus necesidades.

## Notas importantes para Windows Server 2016

1. **Docker en modo Windows**: Asegúrate de que Docker esté configurado en "Windows containers"
2. **Imagen base**: Usa `mcr.microsoft.com/windows/servercore:ltsc2016`
3. **MySQL**: Se recomienda instalarlo como servicio nativo en Windows para mejor estabilidad
4. **Rutas**: Todas las rutas en el contenedor usan formato Windows (`C:\app`)

## Estructura del proyecto

```
Proyecto_Asistencia/
├── config/          # Configuración de base de datos
├── controller/      # Controladores de la aplicación
├── model/          # Modelos de datos
├── routers/        # Rutas de la API
├── views/          # Vistas EJS
├── public/         # Archivos estáticos
├── Dockerfile      # Configuración del contenedor Windows
├── docker-compose.yml         # MySQL en host de Windows
├── docker-compose.hybrid.yml  # MySQL en contenedor Linux
└── install-mysql.ps1          # Script de instalación de MySQL
```

## Solución de problemas

### El contenedor no puede conectarse a MySQL

Verifica que:
- MySQL esté corriendo: `Get-Service MySQL`
- El firewall permita conexiones al puerto 3306
- Las credenciales en `docker-compose.yml` coincidan con las de MySQL

### Error al construir la imagen

- Asegúrate de tener suficiente espacio en disco (>10GB)
- Verifica que Docker esté en modo "Windows containers"
- Revisa los logs: `docker-compose logs app`

## Comandos útiles

```powershell
# Ver logs del contenedor
docker-compose logs -f app

# Detener servicios
docker-compose down

# Reconstruir imagen
docker-compose build --no-cache

# Ver estado de MySQL en Windows
Get-Service MySQL

# Conectar a MySQL desde PowerShell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```
