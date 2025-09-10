import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usuario = db.define('usuario',{
    idUsuario:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre:{ type: DataTypes.STRING },
    apellido:{ type: DataTypes.STRING },
    email:{ type: DataTypes.STRING },
    password:{ type: DataTypes.STRING },
    rol:{ type: DataTypes.STRING },
    estado:{ type: DataTypes.STRING }
});

export default Usuario;