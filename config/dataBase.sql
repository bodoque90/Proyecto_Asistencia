import { Sequelize } from "sequelize";

const db = new Sequelize('PCFactory', 'root', 'Dracogamer90$', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define:{
        timestamps: true
    }
});

export default db;