
Proyecto_Asistencia

Dependencias básicas: Node.js, npm.

Instalación local (opcional):

```powershell
npm install
```

Ejecutar localmente:

```powershell
npm run dev
```

Ejecutar con Docker Compose:

1. Ajusta (si quieres) la contraseña en `docker-compose.yml` (por defecto `example_password`).
2. Levanta los servicios:

```powershell
docker compose up --build
```

La app quedará en http://localhost:3000 y MySQL en el puerto 3306.

Notas:
- `config/db.js` lee variables de entorno: DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME.
- En desarrollo el servicio `app` monta el volumen del proyecto para reflejar cambios sin reconstruir la imagen.
