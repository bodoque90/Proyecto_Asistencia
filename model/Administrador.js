import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Administrador = db.define('administrador',{
    idAdministrador:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre:{ type: DataTypes.STRING(50) },
    email:{ type: DataTypes.STRING(50) },
    password:{ type: DataTypes.STRING(100) }
});

export default Administrador;