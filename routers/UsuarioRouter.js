

import express from "express";
const router = express.Router();
import { viewLogin, viewMenu, agregarEmpleado, loginUsuario, marcarEntrada, marcarSalida, verHistorialAsistencias, obtenerUsuarios, modificarUsuario, eliminarUsuario } from "../controller/usuarioController.js";
// Gestión de usuarios (solo admin)
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", modificarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);


router.get("/", viewLogin);
router.get("/menu", viewMenu);
router.post("/login", loginUsuario);

router.post("/marcar-entrada", marcarEntrada);
router.post("/marcar-salida", marcarSalida);


router.get("/verMarcas", verHistorialAsistencias);
router.post("/agregarEmpleado", agregarEmpleado);


export default router;