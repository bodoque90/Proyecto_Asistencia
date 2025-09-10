import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Asistencia = db.define('asistencia',{
    idAsistencia:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUsuario:{ type: DataTypes.INTEGER },
    fecha:{ type: DataTypes.DATEONLY },
    horaEntrada:{ type: DataTypes.TIME },
    horaSalida:{ type: DataTypes.TIME },
});

export default Asistencia;