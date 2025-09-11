
import express from "express";
import { viewLogin, viewMenu, agregarEmpleado, loginUsuario, marcarEntrada, marcarSalida, verHistorialAsistencias } from "../controller/usuarioController.js";
const router = express.Router();


router.get("/", viewLogin);
router.get("/menu", viewMenu);
router.post("/login", loginUsuario);

router.post("/marcar-entrada", marcarEntrada);
router.post("/marcar-salida", marcarSalida);


router.get("/verMarcas", verHistorialAsistencias);
router.post("/agregarEmpleado", agregarEmpleado);


export default router;