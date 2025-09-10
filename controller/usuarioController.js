import path from "path";
import fs from "fs";
import Trabajador from "../model/Trabajador.js";

//vista principal
const viewLogin = (req, res) => {
  res.render("login");
};

const viewMenu = (req,res) => {
  const tipoUsuario = req.session?.tipoUsuario || 'admin';
  res.render("menu",{tipoUsuario});
}

const viewAgregar=(req,res)=>{
  res.render("agregar");
}

const agregarEmpleado = async(req, res) => {
  const empleado =await Trabajador.create(req.body);
  res.render(empleado);
}
//exportar funciones
export { viewLogin, viewMenu,agregarEmpleado,viewAgregar };