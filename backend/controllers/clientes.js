const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const Informe = require('../models/informes');
const Cliente = require('../models/clientes');
const Rutina = require('../models/rutinas');
const { compruebaPlanes } = require('../helpers/compruebaPlanes');
const { generatePasswordRand } = require('../helpers/generadorPass');
const { sendMail } = require('../helpers/emailer');
const { sendMail2 } = require('../helpers/emailer2');

/*
get / 
<-- desde? el salto para buscar en la coleccion clientes
    id? un identificador concreto, solo busca a este
--> sino devuelve todos los clientes
*/
const obtenerClientes = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || "";

    const {...object } = req.body;
    //recogemos el rol y el id presentes en el token del header
    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    let arrayInfoRut = []; // array para las rutinas e informes de un cliente



    try {

        let clientes, total, fisios;
        //Si es admin puede ver toda la lista
        if (rolToken == "ROL_ADMIN") {
            // Si ha llegado ID, hacemos el get /id
            if (id) {

                [clientes, total] = await Promise.all([
                    Cliente.findById(id),
                    Cliente.countDocuments()
                ]);

            }
            // Si no ha llegado ID, hacemos el get / paginado
            else {
                [clientes, total, fisios] = await Promise.all([
                    Cliente.find({}).skip(desde).limit(registropp),
                    Cliente.countDocuments(),
                    Cliente.find({}).skip(desde).limit(registropp).populate('listaFisios')
                ]);
            }

        } else {
            if (idToken) {
                [clientes, total] = await Promise.all([
                    Cliente.findById(idToken).populate('informes').populate('rutinas.rutina'),
                    Cliente.countDocuments()
                ]);
                arrayInfoRut.push(clientes.rutinas);
                arrayInfoRut.push(clientes.informes);

            }
        }
        return res.status(200).json({
            ok: true,
            msg: 'obtenerClientes',

            page: {
                desde,
                registropp,
                total,
                rolToken,
                idToken,
                fisios,
                clientes,
                arrayInfoRut
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniedo clientes'
        });
    }
}

const obtenerClienteChatbot = async(req, res) => {
    // Obtenemos el ID de usuario
    const id = req.params.id || "";
    let clientes, total;

    try {
        if (id) {
            [clientes, total] = await Promise.all([
                Cliente.findById(id).populate('informes').populate('rutinas.rutina'),
                Cliente.countDocuments()
            ]);
        }
        return res.status(200).json({
            ok: true,
            msg: 'obtenerClienteChatbot',

            page: {
                total,
                clientes
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniendo cliente para el chatbot'
        });
    }
}

const obtenerClientes2 = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id;

    const {...object } = req.body;
    //recogemos el rol y el id presentes en el token del header
    const rolToken = req.rolToken;
    const idToken = req.uidToken;



    try {

        let clientes, total, fisios;
        //Si es admin puede ver toda la lista
        if (rolToken == "ROL_ADMIN") {
            // Si ha llegado ID, hacemos el get /id
            if (id) {

                [clientes, total] = await Promise.all([
                    Cliente.findById(id).skip(desde).limit(registropp),
                    Cliente.countDocuments()
                ]);

            }
            // Si no ha llegado ID, hacemos el get / paginado
            else {
                [clientes, total, fisios] = await Promise.all([
                    Cliente.find({})
                    .skip(desde),
                    Cliente.countDocuments(),
                    Cliente.find({})
                    .skip(desde)
                    .limit(registropp)
                    .populate('listaFisios')
                ]);
            }
        }
        return res.status(200).json({
            ok: true,
            msg: 'obtenerUsuarios',
            clientes,
            page: {
                desde,
                registropp,
                total,
                rolToken,
                idToken,
                fisios
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniedo clientes'
        });
    }
}

const obtenerInformesCliente2 = async(req, res) => {

    const uidFisio = req.query.uidFisio;

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de informe por si quiere buscar solo un usuario
    const idfisio = req.query.id || "";
    try {

        const token = req.header("x-token");

        const idToken = req.uidToken;
        var informesCliente = [];

        var total;
        var cliente = await Cliente.findById(idToken);
        // var fisio = await Usuario.findById(uidFisio);
        // Si ha llegado ID todo OK
        if (cliente) {
            //Obtenemos todos los informes
            var informes = await Informe.find();
            //buscamos los informes asociado al cliente y los guardamos en un array para devolver
            for (var i = 0; i < informes.length; i++) {
                if (informes[i].cliente_asociado == idToken && informes[i].fisio_asociado == uidFisio) {
                    informesCliente.push(informes[i]);
                }
            }
            total = informesCliente.length;
            if (textoBusqueda != "") {
                let query = {};
                if (texto) {
                    query = {
                        $or: [
                            { titulo: textoBusqueda }
                        ],
                    };

                    [informesQuery, total] = await Promise.all([
                        Informe.find(query)
                        .skip(desde)
                        .limit(registropp)
                        .collation({ locale: "es" }),
                        Informe.countDocuments(query),
                    ]);
                    var arrayInformes = [];

                    //Recorremos el array resultado de la busqueda por Query
                    //buscando los resultados que coincidan con el cliente y los 
                    //guardamos en un array para devolver
                    for (var i = 0; i < informesQuery.length; i++) {
                        if (informesQuery[i].cliente_asociado == idToken) {
                            arrayInformes.push(informesQuery[i]);
                        }
                    }
                    informesCliente = arrayInformes;


                }
            }
            if (uidFisio) {
                var arrayInfFisio = [];
                for (var i = 0; i < informesCliente.length; i++) {
                    if (informesCliente[i].fisio_asociado == uidFisio) {
                        arrayInfFisio.push(informesCliente[i]);
                    }
                }
                informesCliente = arrayInfFisio;
            }
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente no valido'
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Informes obtenidos",

            informesCliente,
            page: {
                desde,
                registropp,
                total
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo informes",
        });
    }
};

const obtenerRutinasPaginadas = async(req, res) => {

    const uidFisio = req.query.uidFisio;

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de informe por si quiere buscar solo un usuario
    const idfisio = req.query.id || "";

    try {

        const token = req.header("x-token");

        const idToken = req.uidToken;
        var rutinasCliente = [];

        var total;
        var cliente = await Cliente.findById(idToken);
        // Si ha llegado ID todo OK
        if (cliente) {
            //Obtenemos todos los informes
            var rutinas;
            [rutinas] = await Promise.all([
                Cliente.findById(idToken).populate('rutinas.rutina'),
            ]);
            rutinas = rutinas.rutinas;

            if (textoBusqueda != "") {
                let query = {};
                if (texto) {
                    query = {
                        $or: [
                            { titulo: textoBusqueda }
                        ],
                    };

                    [RutinasQuery, total] = await Promise.all([
                        rutinas.find(query)
                        .skip(desde)
                        .limit(registropp)
                        .collation({ locale: "es" }),
                        rutinas.countDocuments(query),
                    ]);

                }
            }
            if (uidFisio) {
                var arrayInfFisio = [];
                for (var i = 0; i < rutinas.length; i++) {
                    if (rutinas[i].rutina.fisio_asignado == uidFisio) {

                        arrayInfFisio.push(rutinas[i]);
                    }
                }
                rutinasCliente = arrayInfFisio;
            }
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente no valido'
            });
        }
        res.status(200).json({
            ok: true,
            msg: "rutinas obtenidos",

            rutinasCliente,
            page: {
                desde,
                registropp,
                total
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo rutinas",
        });
    }
};

const obtenerRutinas = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || "";

    try {
        const token = req.header("x-token");
        const idToken = req.uidToken;
        var rutinas, rutinasQuery;

        let clientes, total;

        if (idToken) {

            [clientes] = await Promise.all([
                Cliente.findById(idToken).populate('rutinas.rutina')
            ]);

            rutinas = clientes.rutinas; // obtenemos solo los rutinas
            total = rutinas.length;

        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Falta ID'
            });
        }

        res.status(200).json({
            ok: true,
            msg: 'Rutinas obtenidas',
            rutinas,
            rutinasQuery,
            page: {
                desde,
                registropp,
                total,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniedo clientes'
        });
    }

};




const actualizarCliente = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, alta, email, ...object } = req.body;
    const uid = req.params.id;
    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    try {
        let cliente = await Cliente.findById(uid);
        let fisio = await Usuario.findById(idToken);

        if (idToken != uid && rolToken != "ROL_FISIO") {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }

        if (cliente) {
            // Si existe un usuario con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (cliente._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        // fisio actualizando su cliente
        if (rolToken == "ROL_FISIO") {
            let bool = 0;
            for (var i = 0; i < fisio.listaClientes.length; i++) {
                if (fisio.listaClientes[i]._id == uid) {
                    bool = 1;;
                }
            }
            if (bool == 0) {
                return res.status(403).json({ //Acceso no autorizado
                    ok: false,
                    msg: 'El usuario no tiene permisos para actualizar este perfil'
                });
            }
        }

        cliente = await Cliente.findByIdAndUpdate(uid, object, { new: true });



        res.json({
            ok: true,
            msg: 'Cliente actualizado',
            cliente: cliente
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando cliente'
        });
    }

}

const cambiarActivoLista = async(req, res = response) => {

    const uid = req.params.id; //id del cliente en la lista
    const rolToken = req.rolToken;
    const idToken = req.uidToken;
    let usuario; //variable para devolver el resultadod de la actualizacion
    try {
        const fisio = await Usuario.findById(idToken);

        if (rolToken != "ROL_FISIO") {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }
        if (!fisio) {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'Fisio no valido'
            });
        }

        if (rolToken == "ROL_FISIO") {
            let bool = 0;
            //Comprobamos que sea su cliente
            for (var i = 0; i < fisio.listaClientes.length; i++) {
                if (fisio.listaClientes[i]._id == uid) {
                    bool = 1;
                    if (fisio.listaClientes[i].activo == true) {
                        fisio.listaClientes[i].activo = false;
                    } else {
                        fisio.listaClientes[i].activo = true;
                    }
                    usuario = await fisio.save();
                }
            }
            if (bool == 0) {
                return res.status(403).json({ //Acceso no autorizado
                    ok: false,
                    msg: 'El usuario no tiene permisos para actualizar este perfil'
                });
            }
        }

        res.json({
            ok: true,
            msg: 'Activo cliente actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando activo cliente'
        });
    }

}

const cambiarActivoRutinaCliente = async(req, res = response) => {

    const uid = req.params.id; //id del cliente
    const idRutina = req.query.idRutina;
    const rolToken = req.rolToken;
    const idToken = req.uidToken;
    let usuario; //variable para devolver el resultadod de la actualizacion
    try {
        const fisio = await Usuario.findById(idToken);
        const cliente = await Cliente.findById(uid);

        if (rolToken != "ROL_FISIO") {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }
        if (!fisio) {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'Fisio no valido'
            });
        }


        let bool = 0;
        let bool2 = 0;
        //Comprobamos que sea su cliente
        for (var i = 0; i < fisio.listaClientes.length; i++) {
            if (fisio.listaClientes[i].cliente == uid) {
                bool = 1;
            }
        }
        if (bool == 0) {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil2'
            });
        }

        for (var j = 0; j < cliente.rutinas.length; j++) {
            if (cliente.rutinas[j].rutina == idRutina) {
                bool2 = 1;
                if (cliente.rutinas[j].activo == true) cliente.rutinas[j].activo = false;
                else cliente.rutinas[j].activo = true;
            }
        }

        usuario = await cliente.save();


        res.json({
            ok: true,
            msg: 'Activo cliente actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando activo cliente'
        });
    }

}



const obtenerListaFisios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    // Obtenemos el ID de cliente por si quiere buscar solo un usuario
    const id = req.query.id || "";

    try {

        const token = req.header("x-token");

        const idToken = req.uidToken;
        var fisios, fisiosQuery;

        var clientes, total;
        // Si ha llegado ID todo OK
        if (idToken) {
            var fisioclientes = await Cliente.findById(idToken);
            //Obtenemos el fisio con un populate a fisios
            [clientes] = await Promise.all([
                Cliente.findById(idToken).populate('listaFisios')

            ]);
            fisios = clientes.listaFisios; // obtenemos solo los fisios
            total = fisios.length;

        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Falta ID'
            });
        }

        res.status(200).json({
            ok: true,
            msg: "fisios obtenidos",

            fisios,
            fisiosQuery,
            page: {
                desde,
                registropp,
                total
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo fisios",
        });
    }
}

/*
post / 
<-- nombre, apellidos, email, password, rol?
--> cliente registrado
*/
const crearCliente = async(req, res = response) => {

    const { email } = req.body;
    // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
    const { alta, ...object } = req.body;
    //recogemos el rol y el id presentes en el token del header
    const rolToken = req.rolToken;
    const idToken = req.uidToken;
    const id = req.query.id;
    let fisiorepe = 0;

    try {

        // Comprobar que no existe un cliente con ese email registrado
        const exiteEmail = await Cliente.findOne({ email: email });
        const fisio = await Usuario.findById(idToken);
        let cliente;

        if (exiteEmail) {
            //Comprobamos si viene el id de un fisio, por si lo registra un ADMIN
            if (rolToken == "ROL_ADMIN") {
                if (id) {
                    let compruebafisio = await Usuario.findById(id);
                    //Comprobamos si es un fisio registrado en el sistema
                    if (!compruebafisio || compruebafisio.rol != "ROL_FISIO") {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio incorrecto',
                        });
                    }
                    //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                    for (var i = 0; i < exiteEmail.listaFisios.length; i++) {
                        if (exiteEmail.listaFisios[i] == id) {
                            fisiorepe = 1;
                        }
                    }
                    if (fisiorepe == 1) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio repetido',
                        });
                    }


                    //Incrementamos el numero de clientes del fisio
                    compruebafisio.num_clientes = compruebafisio.num_clientes + 1;
                    //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                    if (compruebafisio.num_clientes > compruebaPlanes(compruebafisio)) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Limite alcanzado',
                        });
                    }
                    //agregamos el fisio a la lista del cliente
                    exiteEmail.listaFisios.push(id);
                    await exiteEmail.save();
                    //agregamos el cliente a la lista del fisio
                    compruebafisio.listaClientes.push(exiteEmail._id);
                    await compruebafisio.save();
                } else {
                    return res.status(400).json({ //Falta el ID del fisio
                        ok: false,
                        msg: 'Faltan parámetros',
                    });
                }
            } else { //FISIO si existe email
                //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                for (var i = 0; i < exiteEmail.listaFisios.length; i++) {
                    if (exiteEmail.listaFisios[i] == idToken) {
                        fisiorepe = 1;
                    }
                }
                if (fisiorepe == 1) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Fisio repetido',
                    });
                }


                //Incrementamos el numero de clientes del fisio
                fisio.num_clientes = fisio.num_clientes + 1;
                //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                if (fisio.num_clientes > compruebaPlanes(fisio)) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Limite alcanzado',
                    });
                }
                //agregamos fisio a la lista del cliente
                exiteEmail.listaFisios.push(idToken);
                await exiteEmail.save();
                //agregamos cliente a la lista del fisio
                var ObjectId = require('mongodb').ObjectId;
                clienteid = new ObjectId(exiteEmail._id); // wrap in ObjectID
                fisio.listaClientes.push({ cliente: clienteid });
                await fisio.save();
            }

        } else {
            // Cifrar la contraseña, obtenemos el salt y ciframos
            const salt = bcrypt.genSaltSync();
            const cpassword = bcrypt.hashSync(generatePasswordRand(4), salt);

            cliente = new Cliente(object);
            cliente.password = cpassword;
            if (rolToken == "ROL_ADMIN") {
                if (id) {
                    let compruebafisio = await Usuario.findById(id);
                    if (!compruebafisio || compruebafisio.rol != "ROL_FISIO") {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio incorrecto',
                        });
                    }
                    //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                    for (var i = 0; i < cliente.listaFisios.length; i++) {
                        if (cliente.listaFisios[i] == id) {
                            fisiorepe = 1;
                        }
                    }
                    if (fisiorepe == 1) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio repetido',
                        });
                    }

                    //Incrementamos el numero de clientes del fisio
                    compruebafisio.num_clientes = compruebafisio.num_clientes + 1;
                    //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                    if (compruebafisio.num_clientes > compruebaPlanes(compruebafisio)) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Limite alcanzado',
                        });
                    }
                    //agregamos fisio a la lista del cliente
                    cliente.listaFisios.push(id);
                    await cliente.save();
                    //agregamos cliente a la lista del fisio
                    var ObjectId = require('mongodb').ObjectId;
                    clienteid = new ObjectId(cliente._id); // wrap in ObjectID
                    compruebafisio.listaClientes.push({ cliente: clienteid });
                    await compruebafisio.save();
                }
            } else {
                if (id) {
                    return res.status(403).json({ //Acceso prohibido
                        ok: false,
                        msg: 'Operación no autorizada',
                    });
                }
                //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                for (var i = 0; i < cliente.listaFisios.length; i++) {
                    if (cliente.listaFisios[i] == id) {
                        fisiorepe = 1;
                    }
                }
                if (fisiorepe == 1) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Fisio repetido',
                    });
                }

                //Incrementamos el numero de clientes del fisio
                fisio.num_clientes = fisio.num_clientes + 1;
                //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                if (fisio.num_clientes > compruebaPlanes(fisio)) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Limite alcanzado',
                    });
                }
                //agregamos fisio a la lista del cliente
                cliente.listaFisios.push(idToken);
                var divisiones = email.split("@", 2);
                cliente.nombre_apellidos = divisiones[0];
                await cliente.save();
                //agregamos cliente a la lista del fisio
                var ObjectId = require('mongodb').ObjectId;
                clienteid = new ObjectId(cliente._id); // wrap in ObjectID
                fisio.listaClientes.push({ cliente: clienteid });
                await fisio.save();
                sendMail(email, clienteid, fisio.nombre_apellidos, cliente.nombre_apellidos);
            }

        }
        return res.status(201).json({ //Cliente creado
            ok: true,
            msg: 'Cliente registrado',
            cliente: cliente
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}

const envioReestablecerPass = async(req, res = response) => {

    const { email } = req.body;

    try {
        const usuario = await Usuario.find({ email: email });
        const cliente = await Cliente.find({ email: email });

        if (!cliente && !usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe para MyKine',
            });
        }

        let enviado = true; // para devolver en la res

        if (cliente) { //si es cliente se le envian los datos del cliente
            sendMail2(email, cliente[0]._id, cliente[0].nombre_apellidos);
        } else if (usuario) { // si es fisio se le envian los datos del fisio
            sendMail2(email, usuario._id, usuario.nombre_apellidos);
        }

        return res.status(201).json({ //Correo para reestablecer contraseña enviado
            ok: true,
            msg: 'Correo enviado',
            enviado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}

const cambiarPassword = async(req, res = response) => { //metodo para cambiar pass al ser registrado por el fisio

    const uid = req.params.id;
    const { nombre_apellidos, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        const clienteBD = await Cliente.findById(uid);
        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }

        // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (nuevopassword !== nuevopassword2) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña repetida no coincide con la nueva contraseña',
            });
        }



        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        clienteBD.password = cpassword;
        clienteBD.nombre_apellidos = nombre_apellidos;

        // Almacenar en BD
        await clienteBD.save();

        return res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }
}

const reestablecerPassword = async(req, res = response) => { //metodo para reestablecer pass

    const uid = req.params.id;
    const { nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // comprobar si es cliente o usuario el que quiere reestablecer su contraseña
        const clienteBD = await Cliente.findById(uid);
        const usuarioBD = await Cliente.findById(uid);
        if (!clienteBD && !usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }
        if (nuevopassword !== nuevopassword2) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña repetida no coincide con la nueva contraseña',
            });
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);

        if (clienteBD) {
            clienteBD.password = cpassword;
            // Almacenar en BD
            await clienteBD.save();
        } else if (usuarioBD) {
            usuarioBD.password = cpassword;
            // Almacenar en BD
            await usuarioBD.save();
        }

        return res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }
}

const actualizarPassword = async(req, res = response) => { //metodo para actualizar contraseña

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;
    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (rolToken != 'ROL_ADMIN' && idToken != uid) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const clienteBD = await Cliente.findById(uid);
        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente incorrecto',
            });
        }

        if (rolToken != "ROL_ADMIN") {
            // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
            // dos veces la contraseña nueva
            const validPassword = bcrypt.compareSync(password, clienteBD.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }



        if (nuevopassword !== nuevopassword2) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña repetida no coincide con la nueva contraseña',
            });
        }



        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        clienteBD.password = cpassword;
        // Almacenar en BD
        await clienteBD.save();

        res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}

const borrarCliente = async(req, res = response) => {

    const uid = req.params.id;
    let resultado; //Variable que mostrará el resultado en el JSON
    const idfisio = req.query.idfisio;

    try {
        //Recogemos el rol y el id presentes en el token del header
        const rolToken = req.rolToken;
        const idToken = req.uidToken;

        const fisio = await Usuario.findById(idToken);
        const cliente = await Cliente.findById(uid);
        //Comprobamos que el cliente exista
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                msg: 'El cliente no existe'
            });
        }
        if (rolToken == "ROL_FISIO") {
            //Miramos que el id del fisio coincida con los que tiene el cliente en su coleccion de fisios
            //y si coincide lo borramos. Si el tamaño del array de fisios del cliente se queda a 0,
            //significa que no tenia mas fisios asociados, por lo que habrá que borrarlo
            for (var i = 0; i < cliente.listaFisios.length; i++) {
                if (cliente.listaFisios[i] == idToken) {
                    cliente.listaFisios.splice(i, 1);
                    await cliente.save();
                    resultado = "El fisio" + fisio.nombre_apellidos + "fue borrado de la lista del cliente" + cliente.nombre_apellidos;
                    //Decrementamos el numero de clientes del fisio
                    fisio.num_clientes = fisio.num_clientes - 1;
                    for (var j = 0; j < fisio.listaClientes.length; j++) {
                        if (fisio.listaClientes[j].cliente == uid) {
                            fisio.listaClientes.splice(j, 1);
                        }
                    }
                    await fisio.save();
                }
            }
        } else { //ADMIN borrando pasando un id de fisio por param
            if (!idfisio) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Acción no autorizada'
                });
            }
            let compruebafisio = await Usuario.findById(idfisio);
            if (!compruebafisio || compruebafisio.rol != "ROL_FISIO") {
                return res.status(400).json({
                    ok: false,
                    msg: 'Fisio incorrecto',
                });
            }
            for (var i = 0; i < cliente.listaFisios.length; i++) {
                if (cliente.listaFisios[i] == idfisio) {
                    cliente.listaFisios.splice(i, 1);
                    await cliente.save();
                    resultado = "El fisio" + fisio.nombre_apellidos + "fue borrado de la lista del cliente" + cliente.nombre_apellidos;
                    //Decrementamos el numero de clientes del fisio
                    fisio.num_clientes = fisio.num_clientes - 1;
                    for (var j = 0; j < fisio.listaClientes.length; j++) {
                        if (fisio.listaClientes[j].cliente == uid) {
                            fisio.listaClientes.splice(j, 1);
                        }
                    }
                    await fisio.save();
                }
            }


        }


        if (cliente.listaFisios.length == 0) {
            // Lo eliminamos y devolvemos el usuaurio recien eliminado
            resultado = await Cliente.findByIdAndRemove(uid);
        }
        let tamarray = cliente.listaFisios.length;

        return res.status(200).json({
            ok: true,
            resultado: resultado,
            uid,
            idfisio,
            tamarray
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Error borrando cliente'
        });
    }
}





module.exports = { obtenerClientes, obtenerClienteChatbot, cambiarActivoLista, cambiarActivoRutinaCliente, obtenerClientes2, actualizarCliente, obtenerInformesCliente2, obtenerRutinas, obtenerRutinasPaginadas, obtenerListaFisios, crearCliente, envioReestablecerPass, cambiarPassword, reestablecerPassword, actualizarPassword, borrarCliente }