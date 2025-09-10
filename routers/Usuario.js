import { type } from "os";
import db from "../config/db.js";
import {DataTypes} from "sequelize";

const Asistencia = db.define('asistencia',{
    idAsistencua:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUsuario:{ type: DataTypes.INTEGER },
    fecha:{ type: DataTypes.DATEONLY },
    horaEntrada:{ type: DataTypes.TIME },
    horaSalida:{ type: DataTypes.TIME }
});

export default Asistencia;