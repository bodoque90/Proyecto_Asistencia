
import express from "express";
import { viewLogin } from "../controller/usuarioController.js";
const router = express.Router();

router.get("/", viewLogin);

export default router;