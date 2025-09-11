import express from 'express';
import Asistencia from './routers/UsuarioRouter.js';
import db from './config/db.js';
import './model/Trabajador.js';
import './model/Asistencia.js';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

app.use(session({
  secret: 'asistencia_secreta', // Cambia esto por una clave segura
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/', Asistencia);

const __filename = fileURLToPath(import.meta.url);

async function iniciarApp() {
    try {
        await db.authenticate();
        console.log('Conexión a la base de datos exitosa');
        await db.sync();
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }
}

iniciarApp();