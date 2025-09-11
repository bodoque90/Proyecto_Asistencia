import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Usuario from "./Trabajador.js";

const Asistencia = db.define('asistencia',{
    idAsistencia:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha:{ type: DataTypes.DATEONLY },
    horaEntrada:{ type: DataTypes.TIME },
    horaSalida:{ type: DataTypes.TIME },
    idUsuario:{ type: DataTypes.INTEGER }
});


Asistencia.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

export default Asistencia;