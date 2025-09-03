import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});


const __filename = fileURLToPath(import.meta.url);

app.get('/menu', (req, res) => {
    res.sendFile(path.join(path.dirname(__filename), 'views', 'index.html'));
});