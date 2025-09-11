import Usuario from "./model/Trabajador.js";

async function insertarEmpleadosDemo() {
  const empleados = [
    { nombre: "Ana", apellido: "Pérez", email: "ana.perez@email.com", password: "123456", rol: "trabajador", telefono: "111111111", direccion: "Calle 1" },
    { nombre: "Luis", apellido: "Gómez", email: "luis.gomez@email.com", password: "123456", rol: "trabajador", telefono: "222222222", direccion: "Calle 2" },
    { nombre: "María", apellido: "López", email: "maria.lopez@email.com", password: "123456", rol: "trabajador", telefono: "333333333", direccion: "Calle 3" },
    { nombre: "Pedro", apellido: "Soto", email: "pedro.soto@email.com", password: "123456", rol: "trabajador", telefono: "444444444", direccion: "Calle 4" },
    { nombre: "Lucía", apellido: "Ramírez", email: "lucia.ramirez@email.com", password: "123456", rol: "trabajador", telefono: "555555555", direccion: "Calle 5" },
    { nombre: "Carlos", apellido: "Torres", email: "carlos.torres@email.com", password: "123456", rol: "trabajador", telefono: "666666666", direccion: "Calle 6" },
  { nombre: "Sofía", apellido: "Martínez", email: "sofia.martinez@email.com", password: "123456", rol: "trabajador", telefono: "777777777", direccion: "Calle 7" },
  { nombre: "Valentina", apellido: "Navarro", email: "valentina.navarro@email.com", password: "123456", rol: "trabajador", telefono: "888888888", direccion: "Calle 8" },
  { nombre: "Javier", apellido: "Castro", email: "javier.castro@email.com", password: "123456", rol: "trabajador", telefono: "999999999", direccion: "Calle 9" }
  ];
  for (const emp of empleados) {
    try {
      await Usuario.create(emp);
      console.log(`Empleado ${emp.nombre} insertado`);
    } catch (e) {
      console.error(`Error con ${emp.email}:`, e.message);
    }
  }
}

insertarEmpleadosDemo();
