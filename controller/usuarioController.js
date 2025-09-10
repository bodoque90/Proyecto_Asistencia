import path from "path";
import fs from "fs";

//vista principal
const viewLogin = (req, res) => {
  res.render("login");
};


//exportar funciones
export { viewLogin };