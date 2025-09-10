import express from 'express';
import Asistencia from '..Usuario.js';

const router = express.Router();

// Ruta para registrar entrada
router.post('/entrada', async (req, res) => {
  const { idUsuario } = req.body;
  const fecha = new Date().toISOString().slice(0, 10);
  const horaEntrada = new Date().toTimeString().slice(0, 8);
  try {
    await Asistencia.create({ idUsuario, fecha, horaEntrada });
    res.json({ mensaje: 'Entrada registrada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar entrada' });
  }
});

// Ruta para registrar salida
router.post('/salida', async (req, res) => {
  const { idUsuario } = req.body;
  const fecha = new Date().toISOString().slice(0, 10);
  const horaSalida = new Date().toTimeString().slice(0, 8);
  try {
    const asistencia = await Asistencia.findOne({ where: { idUsuario, fecha } });
    if (!asistencia) {
      return res.status(404).json({ error: 'No se encontró registro de entrada para hoy' });
    }
    asistencia.horaSalida = horaSalida;
    await asistencia.save();
    res.json({ mensaje: 'Salida registrada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar salida' });
  }
});

export default router;
