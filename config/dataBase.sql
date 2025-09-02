create database if not exists asistencia_db;
use asistencia_db;

create table if not exists usuarios(
    idUsuario int primary key auto_increment,
    nombre varchar(50) not null,
    apellido varchar(50) not null,
    correo varchar(100) not null unique,
    contraseña varchar(255) not null,
    rol enum('administrador', 'usuario') not null,
    estado enum('activo', 'inactivo') not null default 'activo'
);

create table if not exists asistencias(
    idAsistencia int primary key auto_increment,
    idUsuario int,
    fecha date not null,
    horaEntrada time not null,
    horaSalida time,
    foreign key (idUsuario) references usuarios(idUsuario)
);

create table if not exists reportes(
    idReporte int primary key auto_increment,
    idUsuario int,
    fechaInicio date not null,
    fechaFin date not null,
    descripcion text,
    tipoReporte enum('atraso', 'salida anticipada', 'inasistencia') not null,
    foreign key (idUsuario) references usuarios(idUsuario)
);