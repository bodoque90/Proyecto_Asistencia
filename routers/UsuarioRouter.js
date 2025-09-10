
import express from "express";
import { viewLogin ,viewMenu,agregarEmpleado,viewAgregar} from "../controller/usuarioController.js";
const router = express.Router();

router.get("/", viewLogin);
router.get("/menu", viewMenu);
router.get("/agregarEmpleado", viewAgregar);

router.post("/guardarUsuario", agregarEmpleado);


export default router;