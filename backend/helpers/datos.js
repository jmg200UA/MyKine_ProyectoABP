// Generador de identificadores únicos para campos que sean unique
const { v4: uuidv4 } = require("uuid");
// Incluir los models que necesitemos para almacenar datos
const Usuarios = require("../models/usuarios");
// Cargar el archivo de configuración
// dentro de config() pasamos el path (la ruta) donde está el archivo .env
require("dotenv").config({ path: "../.env" });
// Cargamos nuestra librería de conexión a la BD, con la ruta adecuada
const { dbConnection } = require("../database/configdb");
dbConnection();
// Creamo una función que genere y almacene datos
const crearUsuarios = async() => {
    // Declaramos variso arrays con datos estáticos, listas de nombres, direcciones, tipos, etc que vamos a utilizar
    const nombres = ["Alberto", "Ángela", "Marcos", "Pepe", "Jesús", "Marta", "Javi", "David", "Ernesto", "Luis", "Ajaz", "Akos", "Adonis", "Aldo", "Amets", "Amaro", "Aquiles", "Algimantas", "Alpidio", "Amrane", "Anish", "Arián", "Ayun", "Azariel", "Bagrat", "Bencomo", "Bertino", "Candi", "Cesc", "Cirino", "Crisólogo", "Cruz", "Danilo", "Dareck", "Dariel", "Darin", "Delmiro", "Damen", "Dilan", "Dipa", "Doménico", "Drago", "Edivaldo", "Elvis", "Elyan", "Emeric", "Engracio", "Ensa", "Eñaut", "Eleazar", "Eros", "Eufemio", "Feiyang", "Fiorenzo", "Foudil", "Galo", "Gastón", "Giulio", "Gautam", "Gentil", "Gianni", "Gianluca", "Giorgio", "Gourav", "Grober", "Guido", "Guifre", "Guim", "Hermes", "Inge", "Irai", "Iraitz", "Iyad", "Iyán", "Jeremías", "Joao", "Jun", "Khaled", "Leónidas", "Lier", "Lionel", "Lisandro", "Lucián", "Mael", "Misael", "Moad", "Munir", "Nael", "Najim", "Neo", "Neil", "Nikita", "Nilo", "Otto", "Pep", "Policarpo", "Radu", "Ramsés", "Rómulo", "Roy", "Severo", "Sidi", "Simeón", "Taha", "Tao", "Vadim", "Vincenzo", "Zaid", "Zigor", "Zouhair", "Mateo", "Martín", "Lucas", "Leo", "Daniel", "Alejandro", "Manuel", "Pablo", "Álvaro", "Adrián", "Enzo", "Mario", "Diego", "David", "Oliver", "Marcos", "Thiago", "Marco", "Álex", "Javier", "Izan", "Bruno", "Miguel", "Antonio", "Gonzalo", "Liam", "Gael", "Marc", "Carlos", "Juan", "Ángel", "Dylan", "Nicolás", "José", "Sergio", "Gabriel", "Luca", "Jorge", "Darío", "Íker", "Samuel", "Eric", "Adam", "Héctor", "Francisco", "Rodrigo", "Jesús", "Erik", "Amir", "Jaime", "Ian", "Rubén", "Aarón", "Iván", "Pau", "Víctor", "Guillermo", "Luis", "Mohamed", "Pedro", "Julen", "Unai", "Rafael", "Santiago", "Saúl", "Alberto", "Noah", "Aitor", "Joel", "Nil", "Jan", "Pol", "Raúl", "Matías", "Martí", "Fernando", "Andrés", "Rayan", "Alonso", "Ismael", "Asier", "Biel", "Ander", "Aleix", "Axel", "Alan", "Ignacio", "Fabio", "Neizan", "Jon", "Teo", "Isaac", "Arnau", "Luka", "Max", "Imran", "Youssef", "Anas", "Elías"];
    const apellidos = ["Segura", "Guillén", "Gómez", "Puentes", "Franco", "Sánchez", "Hernández", "Reina", "Villa", "Iglesias", "Rajoy", "Echenique", "Iniesta", "Bisbal", "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Hernández", "Ruiz", "Díaz", "Moreno", "Muñoz", "Álvarez"];
    const email = ["pepito", "juanito", "sarita", "pelota", "rotulador", "atun"];
    const emailTerm = "@gmail.com";
    const planes = ["Gratis", "Estandar", "Estandar", "Estandar", "Premium"];
    const especialidades = [
        "general",
        "general",
        "general",
        "neurologia",
        "pediatria",
        "geriatria",
        "deportiva",
    ];

    //Que cada uno ponga sus clientes y en producción se modifica para poner los de la BD
    const clientes = [
        //   "620698077fddd3f3c8076eba",
        //   "620d1c8eea4d0319f1722df9",
        //   "6220ff29a030d34c10534ff0",
        //   "620b7c0c67363f134522be99",
        //   "620b7c0c67363f134522be98",
        //   "620b7c0c67363f134522be97",
        //   "620b82cffd91a71b181bff70",
        //   "620b82cffd91a71b181bff71",
        //   "620b82cffd91a71b181bff72",
        //   "620b82cffd91a71b181bff73",
    ];

    const valoraciones = [1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10];

    const sitios = (Math.random() * (42.022727 - 37.371392) + 37.371392) + "," + (Math.random() * (2.456551 - (-8.034660)) + (-8.034660));

    const localizacionesFijas = [
        //Alicante
        "-0.4917554341910863, 38.34181591535423",
        "-0.4985927567745386, 38.34762140969716",
        "-0.48740800155407826, 38.357566530970544",
        "-0.5000920494195353, 38.36902981543849",
        "-0.45854083347278757, 38.365299605389744",
        "-0.47410421826118654, 38.353791246482665",
        "-0.47866688212803504, 38.346541779969016",
        "-0.5078376103714659, 38.34512301491512",
        "-0.5110232819550542, 38.34556366664281",
        "-0.47195478812070496, 38.36450493635134",
        "-0.503617513773739, 38.36546405536392",
        "-0.4363682065500112, 38.40032021435497",
        "-0.43226462867572096, 38.39772589694653",
        "-0.4135361688600532, 38.38734648530812",
        //Valencia
        "-0.3841254746731886, 39.47047012043025",
        "-0.38405482876321817, 39.477679744036124",
        "-0.36797565239798274, 39.46678243694691",
        "-0.38081990644359526, 39.48835028353208",
        "-0.3469353824020171, 39.4606020767483",
        "-0.42693554893937136, 39.49932616519992",
        "-0.4389675718633075, 39.50500155151774",
        "-0.40954164201110577, 39.410599755295166",
        "-0.44376349642995133, 39.512434877632984",
        "-0.38633992935163214, 39.488576453816165",
        //Madrid
        "-3.6958768056669484, 40.410879296862866",
        "-3.696093601419169, 40.41112693036749",
        "-3.702597905019024, 40.409558682266685",
        "-3.713330588647775, 40.4129422217901",
        "-3.6753432265477803, 40.40164067776449",
        "-3.7051266690877642, 40.423917898311444",
        "-3.710668154667378, 40.426763400030865",
        "-3.6838308648100737, 40.44550662984541",
        "-3.715290386671595, 40.443898118417536",
        "-3.670243637259504, 40.38992972121315",
        "-3.7238889894997302, 40.389939339801906",
        "-3.665898914125352, 40.4381501268877"
    ];


    const imagenes = [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg"
    ]

    const unico = uuidv4();
    // A partir de los arrays anteriores, eligiendo posiciones al azar para extrar un nombr, direccion, etc
    const imeil = email[Math.floor(Math.random() * (email.length - 1))] + unico + emailTerm;
    const nombreyapellidos = nombres[Math.floor(Math.random() * (nombres.length - 1))] + " " + apellidos[Math.floor(Math.random() * (apellidos.length - 1))];
    const hespecialidad = especialidades[Math.floor(Math.random() * (especialidades.length))];
    const sitio = localizacionesFijas[Math.floor(Math.random() * (sitios.length - 1))];
    const baloracion = valoraciones[Math.floor(Math.random() * (valoraciones.length - 1))];
    const imagenesrandom = imagenes[Math.floor(Math.random() * (imagenes.length - 1))];
    const contrasenya = "$2a$10$DwzBGSD4eKsO32zm1o8GSe/NsugEnileOaD0BFxcYoXimkL/0h/P.";
    const rolll = "ROL_FISIO";

    const planMes = planes[Math.floor(Math.random() * (planes.length))];

    // Aqui meto en un array un unico ciente para tener al menos uno en la lista, pero da error
    const lista = [
        [clientes[Math.floor(Math.random() * (clientes.length - 1))]]
    ];

    const numeroClientes = lista.length;

    // Generar fechas aleatorias, a partir del día de hoy
    let fecha = new Date(Date.now());
    // Añadimos a fecha un número al azar entre 1 y 90
    fecha.setDate(fecha.getDate() - (Math.floor(Math.random() * 90 + 1) * 2));
    let f_ini = fecha;
    // Añadimos a la fecha mofificada un número de horas al azar entre 1 y 8
    fecha.getHours(fecha.getHours() + Math.floor(Math.random() * 8 + 1));
    let f_fin = fecha;

    // Construimos un objeto con la estructura que espera el modelo y los datos generados
    const datos = {
        nombre_apellidos: nombreyapellidos,
        email: imeil,
        password: contrasenya,
        rol: rolll,
        planMensual: planMes,
        num_clientes: numeroClientes,
        alta: f_fin,
        listaClientes: lista,
        especialidad: hespecialidad,
        sitio_Fisio: {
            nombre_sitio: "casi",
            localizacion_sitio: sitio
        },
        imagen: imagenesrandom,
        valoracion: baloracion

    };
    // Lo imprimimos por pantalla
    // Creamos un objeto de moongose del modelo con los datos a guardar
    const nuevoUsuario = new Usuarios(datos);
    // Guardamos en BD
    await nuevoUsuario.save();
};
// Bucle para llamar a la función las veces que queramos, así insertamos 1 o 1000 elementos
for (let index = 0; index < 500; index++) {
    crearUsuarios();
}