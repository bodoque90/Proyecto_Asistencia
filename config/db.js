import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

// Configuración de conexión desde variables de entorno (con valores por defecto)
const DB_NAME = process.env.DB_NAME || 'asistencia_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Dracogamer90$';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

// Intentará crear la base de datos si no existe, con reintentos para esperar a que MySQL esté listo.
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
async function ensureDatabaseReady() {
    const maxAttempts = 10;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const tmpConn = await mysql.createConnection({
                host: DB_HOST,
                port: DB_PORT,
                user: DB_USER,
                password: DB_PASS,
            });
            await tmpConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
            await tmpConn.end();
            return;
        } catch (err) {
            if (attempt === maxAttempts) throw err;
            console.log(`Esperando MySQL (${attempt}/${maxAttempts}) - reintentando en 3s...`);
            await delay(3000);
        }
    }
}

// Ejecuta la comprobación antes de inicializar Sequelize (top-level await ok con type: module)
await ensureDatabaseReady();

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: true,
    },
});

export default db;