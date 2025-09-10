import { type } from "os";
import db from "../config/db.js";
import {DataTypes} from "sequelize";
import { readFileSync, writeFileSync} from 'fs';
import path from 'path';
import fs from 'fs';

const viewLogin = (req, res) => {
    res.render('/view/login.html');
}

const Asistencia = db.define('asistencia',{
    idAsistencua:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUsuario:{ type: DataTypes.INTEGER },
    fecha:{ type: DataTypes.DATEONLY },
    horaEntrada:{ type: DataTypes.TIME },
    horaSalida:{ type: DataTypes.TIME }
});

export const registrarEntrada = async () => {
    const{idUsuario}= req.body;
    const fecha = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const horaEntrada = new Date().toTimeString().split(' ')[0]; 
    try{
        await Asistencia.create({idUsuario, fecha, horaEntrada});
        res.json({message: 'Entrada registrada correctamente'});
        
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al registrar la entrada'});
    }
};


export {viewLogin};