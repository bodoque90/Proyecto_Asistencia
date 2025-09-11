// Obtener todos los usuarios (excepto el admin logueado)
import { Op } from "sequelize";
const obtenerUsuarios = async (req, res) => {
  try {
    if (req.session.tipoUsuario !== 'administrador') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const adminId = req.session.usuarioId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    // Filtros recibidos por query
    const { nombre, apellido, email, rol } = req.query;
    const where = { idUsuario: { [Op.ne]: adminId } };

    if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
    if (apellido) where.apellido = { [Op.like]: `%${apellido}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (rol) where.rol = rol;

    const { count, rows } = await Usuario.findAndCountAll({
      where,
      attributes: ['idUsuario', 'nombre', 'apellido', 'email', 'rol', 'telefono', 'direccion'],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['nombre', 'ASC']]
    });
    const totalPages = Math.ceil(count / pageSize);
    res.json({ usuarios: rows, totalPages, page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Modificar usuario
const modificarUsuario = async (req, res) => {
  try {
    if (req.session.tipoUsuario !== 'administrador') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const { id } = req.params;
    const { nombre, apellido, email, rol, telefono, direccion } = req.body;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.email = email;
    usuario.rol = rol;
    usuario.telefono = telefono;
    usuario.direccion = direccion;
    await usuario.save();
    res.json({ message: 'Usuario modificado correctamente' });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError' && error.errors[0].path === 'email') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ error: 'Error al modificar usuario' });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    if (req.session.tipoUsuario !== 'administrador') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
import path from "path";
import fs from "fs";

import Usuario from "../model/Trabajador.js";
import Asistencia from "../model/Asistencia.js";


// Historial de asistencias en JSON para el modal
const verHistorialAsistencias = async (req, res) => {
  try {
    if (req.session.tipoUsuario !== 'administrador') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const tipo = req.query.tipo; // 'atrasados', 'anticipados' o undefined
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const asistencias = await Asistencia.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'email'] }],
      order: [['fecha', 'DESC'], ['horaEntrada', 'DESC']]
    });
    let resultado = asistencias.map(a => ({
      nombre: a.usuario?.nombre || '',
      apellido: a.usuario?.apellido || '',
      email: a.usuario?.email || '',
      fecha: a.fecha,
      horaEntrada: a.horaEntrada,
      horaSalida: a.horaSalida
    }));
    if (tipo === 'atrasados') {
      resultado = resultado.filter(a => a.horaEntrada && a.horaEntrada > '09:30:00');
    } else if (tipo === 'anticipados') {
      resultado = resultado.filter(a => a.horaSalida && a.horaSalida < '17:30:00');
    }
    const total = resultado.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = resultado.slice((page - 1) * pageSize, page * pageSize);
    res.json({ datos: paginated, totalPages, page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// Marcar entrada
const marcarEntrada = async (req, res) => {
  try {
    const idUsuario = req.session.usuarioId;
    if (!idUsuario) return res.status(401).send("No autenticado");
    const hoy = new Date().toISOString().slice(0, 10);
    const hora = new Date().toTimeString().slice(0, 8);
    // Buscar si ya existe asistencia para hoy
    let asistencia = await Asistencia.findOne({ where: { idUsuario, fecha: hoy } });
    if (!asistencia) {
      asistencia = await Asistencia.create({ idUsuario, fecha: hoy, horaEntrada: hora });
      return res.send("Entrada registrada: " + hora);
    } else {
      // Si ya existe, solo actualiza la hora de entrada si no está puesta
      if (!asistencia.horaEntrada) {
        asistencia.horaEntrada = hora;
        await asistencia.save();
        return res.send("Entrada registrada: " + hora);
      } else {
        return res.status(400).send("Ya marcaste tu entrada hoy.");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al marcar entrada");
  }
};

// Marcar salida
const marcarSalida = async (req, res) => {
  try {
    const idUsuario = req.session.usuarioId;
    if (!idUsuario) return res.status(401).send("No autenticado");
    const hoy = new Date().toISOString().slice(0, 10);
    const hora = new Date().toTimeString().slice(0, 8);
    // Buscar asistencia de hoy
    let asistencia = await Asistencia.findOne({ where: { idUsuario, fecha: hoy } });
    if (!asistencia) {
      return res.status(400).send("Primero debes marcar tu entrada.");
    }
    if (asistencia.horaSalida) {
      return res.status(400).send("Ya marcaste tu salida hoy.");
    }
    asistencia.horaSalida = hora;
    await asistencia.save();
    res.send("Salida registrada: " + hora);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al marcar salida");
  }
};


// Vista principal
const viewLogin = (req, res) => {
  res.render("login");
};

// Validar credenciales de login
const loginUsuario = async (req, res) => {
  const { usuario, password } = req.body;
  try {
    // Buscar solo por email y contraseña, ignorando mayúsculas/minúsculas en el email
    const user = await Usuario.findOne({
      where: {
        email: usuario.trim().toLowerCase(),
        password: password
      }
    });
    if (!user) {
      return res.status(401).send("Credenciales incorrectas");
    }
    req.session.tipoUsuario = user.rol;
    req.session.usuarioId = user.idUsuario;
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al iniciar sesión");
  }
};

const viewMenu = (req,res) => {
  const tipoUsuario = req.session?.tipoUsuario || 'admin';
  res.render("menu",{tipoUsuario});
}


const agregarEmpleado = async(req, res) => {
  try {
    const empleado = await Usuario.create(req.body);
    console.log(empleado);
    res.send("Empleado agregado correctamente");
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError' && error.errors[0].path === 'email') {
      return res.status(400).send("El correo electrónico ya está registrado.");
    }
    res.status(500).send("No se pudo agregar el empleado");
  }
}
//exportar funciones
export { viewLogin, viewMenu, agregarEmpleado, loginUsuario, marcarEntrada, marcarSalida, verHistorialAsistencias, obtenerUsuarios, modificarUsuario, eliminarUsuario };