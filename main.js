import express from 'express';
import Asistencia from './routers/UsuarioRouter.js';
import db from './config/db.js';
import './model/Administrador.js';
import './model/Trabajador.js';


import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

app.use(express.static('public'));
app.use(express.json());

app.set('view engine', 'ejs');

app.use('/', Asistencia);
const __filename = fileURLToPath(import.meta.url);

    try {
        await db.authenticate();
        console.log('Conexión a la base de datos exitosa');
        await db.sync();
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }



