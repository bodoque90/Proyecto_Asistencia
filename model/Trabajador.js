import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usuario = db.define('usuario',{
    idUsuario:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre:{ type: DataTypes.STRING },
    apellido:{ type: DataTypes.STRING },
    email:{ type: DataTypes.STRING },
    password:{ type: DataTypes.STRING },
    rut :{ type: DataTypes.STRING },
    telefono:{ type: DataTypes.STRING },
    direccion:{ type: DataTypes.STRING },
    fecha :{ type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    horaEntrada:{ type: DataTypes.TIME },
    horaSalida:{ type: DataTypes.TIME }
});

export default Usuario;