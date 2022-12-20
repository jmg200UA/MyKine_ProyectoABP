// Generador de identificadores únicos para campos que sean unique
const { v4: uuidv4 } = require("uuid");
// Incluir los models que necesitemos para almacenar datos
const Clientes = require("../models/clientes");
// Cargar el archivo de configuración
// dentro de config() pasamos el path (la ruta) donde está el archivo .env
require("dotenv").config({ path: "../.env" });
// Cargamos nuestra librería de conexión a la BD, con la ruta adecuada
const { dbConnection } = require("../database/configdb");
dbConnection();
// Creamo una función que genere y almacene datos
const crearClientes = async() => {
    // Declaramos variso arrays con datos estáticos, listas de nombres, direcciones, tipos, etc que vamos a utilizar
    const nombres = [
        "Gervasio Romero",
        "Antonio  Muñoz",
        "Federico García",
        "Vin Diesel",
        "Guillermo Díaz",
        "Caperucita Roja",
        "Taran Tino",
    ];
    const email = ["esperanza", "wyllirex", "aurelio", "benito", "eustaquio", "joven"];
    const emailTerm = "@gmail.com";
    const imagenes = [
        "1.jpg",
        "2.jpg",
        "3.jpg",
        "4.jpg",
        "5.jpg",
        "6.jpg",
        "7.jpg",
        "8.jpg",
        "9.jpg",
        "10.jpg",
        "11.jpg",
    ];

    // const planes = ["Gratis", "Estandar", "Premium"];
    const unico = uuidv4();
    // A partir de los arrays anteriores, eligiendo posiciones al azar para extrar un nombr, direccion, etc
    const imeil =
        email[Math.floor(Math.random() * (email.length - 1))] + unico + emailTerm;
    const nombreyapellidos =
        nombres[Math.floor(Math.random() * (nombres.length - 1))];
    const contrasenya =
        "$2a$10$DwzBGSD4eKsO32zm1o8GSe/NsugEnileOaD0BFxcYoXimkL/0h/P.";
    const imagenesrandom =
        imagenes[Math.floor(Math.random() * (imagenes.length - 1))];

    // Generar fechas aleatorias, a partir del día de hoy
    let fecha = new Date(Date.now());
    // Añadimos a fecha un número al azar entre 1 y 90
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 90 + 1) * 2);
    let f_ini = fecha;
    // Añadimos a la fecha mofificada un número de horas al azar entre 1 y 8
    fecha.getHours(fecha.getHours() + Math.floor(Math.random() * 8 + 1));
    let f_fin = fecha;

    // Construimos un objeto con la estructura que espera el modelo y los datos generados
    const datos = {
        nombre_apellidos: nombreyapellidos,
        email: imeil,
        password: contrasenya,
        alta: f_fin,
        imagen: imagenesrandom,
        //Falta añadir fisios de listaFisio
    };
    // Lo imprimimos por pantalla
    // Creamos un objeto de moongose del modelo con los datos a guardar
    const nuevoCliente = new Clientes(datos);
    // Guardamos en BD
    await nuevoCliente.save();
};
// Bucle para llamar a la función las veces que queramos, así insertamos 1 o 1000 elementos
for (let index = 0; index < 400; index++) {
    crearClientes();
}