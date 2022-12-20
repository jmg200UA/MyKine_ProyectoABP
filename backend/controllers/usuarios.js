const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { infoToken } = require('../helpers/infotoken');
const dfff = require('dialogflow-fulfillment'); //para chatbot

const Usuario = require('../models/usuarios');
const Cliente = require('../models/clientes');
const Informe = require('../models/informes');
/*
get / 
<-- desde? el salto para buscar en la lista de usuarios
    id? un identificador concreto, solo busca a este
--> devuleve todos los usuarios
*/

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const listaUsuarios = async(req, res) => {
    const lista = req.body.lista;

    if (!lista) {
        res.status(400).json({
            ok: true,
            msg: 'listaUsuarios',
            usuarios: 'none',
        });
    }

    // Solo puede listar usuarios un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(403).json({ //Acceso no autorizado
            ok: false,
            msg: 'No tiene permisos para listar usuarios',
        });
    }

    try {
        const usuarios = await Usuario.find({ _id: { $in: lista }, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.status(200).json({
            ok: true,
            msg: 'Lista de usuarios obtenido',
            usuarios
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al listar usuarios por uids',
        });
    }

}

const listaUsuariosRol = async(req, res) => {
    const rol = req.params.rol;
    const lista = req.body.lista;

    // Solo puede listar usuarios un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(403).json({ //Acceso no autorizado
            ok: false,
            msg: 'No tiene permisos para listar usuarios',
        });
    }

    listaB = [];
    if (!lista) { listaB = []; }

    try {
        const usuarios = await Usuario.find({ _id: { $nin: lista }, rol: rol, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.status(200).json({
            ok: true,
            msg: 'Lista de usuarios obtenida',
            usuarios
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al listar usuarios por rol',
            error
        });
    }

}

const obtenerUsuarioToken = async(req, res) => {

    const idToken = req.uidToken;
    let usuario;

    try {
        if (!idToken) {
            return res.status(400).json({
                ok: false,
                msg: "No tiene permisos para listar usuarios",
            });
        }
        usuario = await Usuario.findById(idToken);

        res.status(200).json({
            ok: true,
            msg: "Usuario obtenido",
            usuario
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo usuarios",
        });
    }
};

//METODO DE JOSE VICENTE
const obtenerUsuarios = async(req, res) => {
    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || "";

    //await sleep(1000);
    try {
        // Solo puede listar usuarios un admin
        const token = req.header("x-token");
        if (!(infoToken(token).rol === "ROL_ADMIN" || infoToken(token).uid === id)) {
            return res.status(400).json({
                ok: false,
                msg: "No tiene permisos para listar usuarios",
            });
        }



        let usuarios, total, fisiiioss;
        // Si ha llegado ID, hacemos el get /id
        if (id) {
            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments(),
            ]);
        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            let query = {};
            if (texto) {
                query = {
                    $or: [
                        { nombre_apellidos: textoBusqueda },
                        { email: textoBusqueda },
                    ],
                };
            }

            [usuarios, total, fisiiioss] = await Promise.all([
                Usuario.find(query)
                .skip(desde)
                .limit(registropp)
                .collation({ locale: "es" })
                .sort({ nombre_apellidos: 1 }),
                Usuario.countDocuments(query),
                Usuario.find({ "rol": "ROL_FISIO" }).count(),
            ]);
        }

        res.status(200).json({
            ok: true,
            msg: "Usuarios obtenidos",
            usuarios,
            page: {
                desde,
                registropp,
                total,
                fisiiioss
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo usuarios",
        });
    }
};

const obtenerUsuarios2 = async(req, res) => {
    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || "";
    try {
        // Solo puede listar usuarios un admin
        const token = req.header("x-token");
        if (!(infoToken(token).rol === "ROL_ADMIN" || infoToken(token).uid === id)) {
            return res.status(400).json({
                ok: false,
                msg: "No tiene permisos para listar usuarios",
            });
        }

        let usuarios, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {
            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments(),
            ]);
        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            let query = {};
            if (texto) {
                query = {
                    $or: [
                        { nombre_apellidos: textoBusqueda },
                        { email: textoBusqueda },
                    ],
                };
            }

            [usuarios, total] = await Promise.all([
                Usuario.find(query)
                .skip(desde)
                .collation({ locale: "es" })
                .sort({ apellidos: 1, nombre: 1 }),
                Usuario.countDocuments(query),
            ]);
        }

        res.status(200).json({
            ok: true,
            msg: "Usuarios obtenidos",
            usuarios,
            page: {
                desde,
                registropp,
                total,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo usuarios",
        });
    }
};

const obtenerPremiums = async(req, res) => {

    try {
        var usuarios, total;
        [usuarios] = await Promise.all([
            Usuario.find({
                "rol": "ROL_FISIO",
                "planMensual": { $in: ["Premium", "Estandar"] }
            })
        ]);
        total = usuarios.length;

        res.status(200).json({
            ok: true,
            msg: "Usuarios premium obtenidos",
            usuarios,
            total
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo usuarios",
        });
    }
};

const obtenerPremiumsPaginados = async(req, res) => {

    //Para paginacion
    var orden = String(req.query.orden);

    //Numero por pagina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";

    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }

    try {
        let usuarios, total;

        let query = {};
        if (texto) {
            query = {
                $or: [
                    { nombre_apellidos: textoBusqueda },
                    { especialidad: textoBusqueda },
                ],
            };
        }

        [usuarios, total] = await Promise.all([
            Usuario.find(query).find({
                "rol": "ROL_FISIO",
                "planMensual": { $in: ["Premium", "Estandar"] }
            })
            .skip(desde)
            .limit(registropp)
            .collation({ locale: "es" }),
            Usuario.countDocuments(query)
        ]);

        res.status(200).json({
            ok: true,
            msg: "Usuarios premium obtenidos",
            usuarios,
            page: {
                desde,
                registropp,
                total,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo usuarios",
        });
    }
};

//GET obtener listaCLientes fisio
const obtenerListaClientes = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de cliente por si quiere buscar solo un usuario
    const id = req.query.id || "";
    try {

        const token = req.header("x-token");

        const idToken = req.uidToken;
        var clientes, clientesQuery;

        var usuarios, total;
        // Si ha llegado ID todo OK
        if (idToken) {
            //Obtenemos el fisio con un populate a clientes
            [usuarios] = await Promise.all([
                Usuario.findById(idToken).populate('listaClientes.cliente')

            ]);
            clientes = usuarios.listaClientes; // obtenemos solo los clientes
            total = clientes.length;
            if (textoBusqueda != "") {
                let query = {};
                if (texto) {
                    query = {
                        $or: [
                            { nombre_apellidos: textoBusqueda },
                            { email: textoBusqueda },
                        ],
                    };
                    let clienteQuery = [];
                    for (var i = 0; i < clientes.length; i++) {
                        if (clientes[i].cliente.nombre_apellidos.includes(texto) || clientes[i].cliente.email.includes(texto)) {
                            clienteQuery.push(clientes[i]);
                        }
                    }
                    clientes = clienteQuery;
                }
            }
            if (id) {
                let cliente;
                for (var i = 0; i < clientes.length; i++) {
                    if (clientes[i].cliente._id == id) clientes = clientes[i];
                }
            }

        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Falta ID'
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Clientes obtenidos",

            clientes,
            clientesQuery,
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
            msg: "Error obteniendo clientes",
        });
    }
};

//GET obtenerInformes fisio
const obtenerInformesFisio = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de informe por si quiere buscar solo un usuario
    const id = req.query.id || "";

    try {

        const token = req.header("x-token");
        const idToken = req.uidToken;
        var informesFisio = [];

        var total;
        // Si ha llegado ID todo OK
        if (idToken) {
            //Obtenemos todos los informes
            var informes = await Informe.find().populate('cliente_asociado');
            //buscamos los informes asociado al fisio y los guardamos en un array para devolver
            for (var i = 0; i < informes.length; i++) {
                if (informes[i].fisio_asociado == idToken) informesFisio.push(informes[i]);
            }
            total = informesFisio.length;
            if (textoBusqueda != "") {
                let query = {};
                if (texto) {
                    query = {
                        $or: [
                            { titulo: textoBusqueda },
                        ],
                    };

                    [informesQuery, total] = await Promise.all([
                        Informe.find(query).populate('cliente_asociado')
                        .skip(desde)
                        .limit(registropp)
                        .collation({ locale: "es" })
                        .sort({ nombre_apellidos: 1 }),
                        Informe.countDocuments(query),
                    ]);
                    var arrayInformes = [];
                    //Recorremos el array resultado de la busqueda por Query
                    //buscando los resultados que coincidan con el fisio y los 
                    //guardamos en un array para devolver
                    for (var i = 0; i < informesQuery.length; i++) {
                        if (informesQuery[i].fisio_asociado == idToken) arrayInformes.push(informesQuery[i]);

                    }
                    informesFisio = arrayInformes;
                }
            }
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Falta ID'
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Informes obtenidos",

            informesFisio,
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

/*
post / 
<-- nombre, apellidos, email, password, rol?
--> usuario registrado
*/
const crearUsuario = async(req, res = response) => {

    const { email, password, localizacion, especialidad } = req.body;
    // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
    const { alta, ...object } = req.body;
    const planMensual = object.planMensual;


    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    try {

        // Comprobar que no existe un usuario con ese email registrado
        const exiteEmail = await Usuario.findOne({ email: email });

        //Ya hemos validado en el routes que solo sea un admin el que pueda hacer esta operación

        //Vemos si existe el email y si es usuario y lo quiere registrar un fisio
        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya en uso'
            });
        }


        // Cifrar la contraseña, obtenemos el salt y ciframos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        const usuario = new Usuario(object);
        usuario.password = cpassword;
        usuario.rol = "ROL_FISIO";
        if (object.rol) {
            usuario.rol = object.rol;
        }

        //Metemos la localizacion provisional
        usuario.sitio_Fisio.localizacion_sitio = localizacion;

        //Metemos la especialidad
        usuario.especialidad = especialidad;

        //COMPROBAMOS EL PLAN MENSUAL, SINO HAY -> PLAN GRATIS
        if (!planMensual) {
            usuario.planMensual = "Gratis";
        } else if (planMensual != "Gratis" && planMensual != "Estandar" && planMensual != "Premium") {
            return res.status(400).json({
                ok: false,
                msg: 'Plan mensual incorrecto'
            });
        }


        // Almacenar en BD
        await usuario.save();



        res.status(201).json({
            ok: true,
            msg: 'Usuario creado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}





const actualizarPassword = async(req, res = response) => {

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

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }

        if (rolToken != "ROL_ADMIN") {
            // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
            // dos veces la contraseña nueva
            const validPassword = bcrypt.compareSync(password, usuarioBD.password);

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
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

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



/*
post /:id
<-- nombre, apellidos, email, rol   
--> usuario actualizado
*/

const actualizarValoracionFisio = async(req, res = response) => {
    // en este metodo deberemos guardar la valoracion que ha hecho el cliente a su fisio, en su campo valoracion
    // correspondiente al cliente en la listaClientes del fisio, y por otro lado hacer la media de las valoraciones
    // totales que tiene el fisio para actualizar su valoración real general

    // le tenemos que pasar por la request el id del fisio, el del cliente, y la valoracion que se le ha dado
    const { idfisio, idcliente, valoracion } = req.body;

    try {

        let fisio = await Usuario.findById(idfisio);
        let valoracionnum = 0;
        valoracionnum = valoracion;
        let sumavaloraciones = 0;
        let numvaloraciones = 0;
        let valoracionfinal = 0;

        if (!fisio) {
            return res.status(404).json({
                ok: false,
                msg: 'Fisio no encontrado',
            });
        }

        //recorremos la lista del fisio para ir recogiendo todas las valoraciones de sus clientes para actualizar
        // y guardamos la nueva valoracion del cliente pasado por la request

        //aqui guardamos la valoracion que se ha hecho
        for (var i = 0; i < fisio.listaClientes.length; i++) {
            if (fisio.listaClientes[i].cliente.equals(idcliente)) {
                fisio.listaClientes[i].valoracion = valoracion;
            }
        }

        //aqui recorremos todas para recoger los datos
        for (var i = 0; i < fisio.listaClientes.length; i++) {
            if (fisio.listaClientes[i].valoracion != 0) {
                sumavaloraciones = sumavaloraciones + fisio.listaClientes[i].valoracion;
                numvaloraciones = numvaloraciones + 1;
            }
        }

        //calculamos y actualizamos
        valoracionfinal = sumavaloraciones / numvaloraciones;
        fisio.valoracion = valoracionfinal;
        await fisio.save();

        res.status(200).json({
            ok: true,
            msg: 'Valoraciones actualizadas',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const actualizarUsuario = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, alta, email, ...object } = req.body;
    const uid = req.params.id;


    try {

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un usuaruio en BD con el email que nos llega en post
        const existeEmail = await Usuario.findOne({ email: email });
        const idToken = req.uidToken;
        const token = req.header("x-token");

        if (!(infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).uid === uid)) {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }

        if (existeEmail) {
            // Si existe un usuario con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;
        // al haber extraido password del req.body nunca se va a enviar en este put
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const actualizarPlan = async(req, res = response) => {

    const { planMensual } = req.body;
    const uid = req.params.id || "";
    try {

        let fisio;
        const idToken = req.uidToken;
        const rolToken = req.rolToken;

        if (planMensual != "Gratis" && planMensual != "Estandar" && planMensual != "Premium") {
            return res.status(400).json({
                ok: false,
                msg: 'Argumentos invalidos'
            });
        }

        //Comprobaremos si es admin, se le deberá pasar el id del fisio a actualizar su plan
        //Si es fisio se hará con su token
        //El plan será cambiado al que venga en el body
        if (rolToken == "ROL_ADMIN") {
            if (!uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Faltan parametros' //Falta uid del fisio a actualizar
                });
            }
            fisio = await Usuario.findById(uid);
            if (fisio.rol != "ROL_FISIO") {
                return res.status(400).json({
                    ok: false,
                    msg: 'No es posible actualizar este usuario' //No es fisio
                });
            }
            if (planMensual != fisio.planMensual) {
                fisio.planMensual = planMensual;
                await fisio.save();
            }
        } else {
            fisio = await Usuario.findById(idToken);
            if (planMensual != fisio.planMensual) {
                fisio.planMensual = planMensual;
                await fisio.save();
            }
        }

        res.json({
            ok: true,
            msg: 'Plan mensual actualizado',
            fisio: fisio
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando plan mensual'
        });
    }

}

/*
delete /:id
--> OK si ha podido borrar
*/
const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;
    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }

        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        let resultado = '';

        if (!existeUsuario.rol == "ROL_FISIO") {
            return res.status(404).json({ //Not found
                ok: true,
                msg: 'El usuario no existe'
            });
        }



        if (rolToken == "ROL_ADMIN") {
            resultado = await Usuario.findByIdAndRemove(uid);
            //Ahora comprobaremos los clientes con los que estaba asociados para borrarle de sus listas
            const clientes = await Cliente.find();
            for (var i = 0; i < clientes.length; i++) {
                for (var j = 0; j < clientes[i].listaFisios.length; j++) {
                    if (clientes[i].listaFisios[j] == uid) {
                        clientes[i].listaFisios.splice(j, 1);
                        await clientes[i].save();
                    }
                }
            }
        }

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }
}





module.exports = { obtenerUsuarios, obtenerUsuarioToken, obtenerUsuarios2, obtenerListaClientes, obtenerInformesFisio, obtenerPremiums, obtenerPremiumsPaginados, crearUsuario, actualizarValoracionFisio, actualizarUsuario, actualizarPlan, borrarUsuario, actualizarPassword, listaUsuarios, listaUsuariosRol }