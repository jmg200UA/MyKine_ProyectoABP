const { response } = require('express');
const validator = require('validator');

const Rutina = require('../models/rutinas');
const Ejercicio = require('../models/ejercicios');
const Cliente = require('../models/clientes');
const Usuario = require('../models/usuarios');


/*
get / 
--> devuleve todas las rutinas
*/
const obtenerRutinas = async(req, res = response) => {

    // Para paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }

    // Obtenemos el ID de la rutina por si quiere buscar solo un rutina
    const id = req.query.id;
    const nombre = req.query.nombre;

    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    var rutinasFisio = [];


    try {


        let rutinas, total;
        if (rolToken == "ROL_FISIO") {
            [rutinas] = await Promise.all([
                Rutina.find().populate('ejercicios').populate('ejercicios.ejercicio')
                .skip(desde)
                .limit(registropp)
                .collation({ locale: "es" })
                .sort({ nombre_apellidos: 1 }),
            ]);

            for (var i = 0; i < rutinas.length; i++) {
                if (rutinas[i].fisio_asignado == "" || rutinas[i].fisio_asignado == idToken) {
                    rutinasFisio.push(rutinas[i]);
                }
            }
            rutinas = rutinasFisio;
            total = rutinas.length;
            if (textoBusqueda != "") {
                let query = {};
                if (texto) {
                    query = {
                        $or: [
                            { nombre: textoBusqueda }
                        ],
                    };

                    [rutinasQuery, total] = await Promise.all([
                        Rutina.find(query).populate('ejercicios.ejercicio')
                        .skip(desde)
                        .limit(registropp)
                        .collation({ locale: "es" })
                        .sort({ nombre_apellidos: 1 }),
                        Rutina.countDocuments(query),
                    ]);
                }
                //Para filtrar las rutinas del sistema o ese fisio
                rutinasFisio = [];
                for (var i = 0; i < rutinasQuery.length; i++) {
                    if (rutinasQuery[i].fisio_asignado == "" || rutinasQuery[i].fisio_asignado == idToken) {
                        rutinasFisio.push(rutinasQuery[i]);
                    }
                }
                rutinas = rutinasFisio;
                if (id) {
                    for (var i = 0; i < rutinas.length; i++) {
                        if (rutinas[i]._id == id) {
                            rutinas = rutinas[i];
                        }
                    }
                }
            }
            if (id) {
                rutinas = await Rutina.findById(id).populate('ejercicios').populate('ejercicios.ejercicio');
            }
        } else {
            if (id) {
                rutinas = await Rutina.findById(id).populate('ejercicios').populate('ejercicios.ejercicio');
            } else {
                [rutinas, total] = await Promise.all([
                    Rutina.find({}).skip(desde).limit(registropp),
                    Rutina.countDocuments()
                ]);
            }

        }

        return res.status(200).json({
            ok: true,
            msg: 'obtenerRutinas',
            rutinas,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniendo rutinas'
        });
    }
}

//GET para obtener los ejercicios populate de una rutina
const obtenerEjerciciosRutina = async(req, res = response) => {

    // Obtenemos el ID de la rutina de la que queremos los ejercicios
    const id = req.params.id;

    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    var ejerciciosRutina = [];
    let total;
    try {

        if (!id) {
            return res.status(400).json({
                ok: false,
                msg: 'Hace falta parametro' //ID rutina
            });
        }
        const rutina = await Rutina.findById(id);
        [ejerciciosTodos] = await Promise.all([
            Ejercicio.find()
        ]);
        for (var i = 0; i < rutina.ejercicios.length; i++) {
            for (var j = 0; j < ejerciciosTodos.length; j++) {
                if (rutina.ejercicios[i].ejercicio == ejerciciosTodos[j]._id.toString()) {
                    ejerciciosRutina.push(ejerciciosTodos[j]);
                }
            }
        }
        total = ejerciciosRutina.length;

        return res.status(200).json({
            ok: true,
            msg: 'obtenerEjerciciosRutina',
            ejerciciosRutina,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniendo ejercicios de rutina'
        });
    }
}


const crearRutina = async(req, res = response) => {

    const { ejercicios } = req.body;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;


    try {

        let rutina;
        let fisio;

        let listaejerciciosinsertar = [];

        if (ejercicios) {
            let listaejerciciosbusqueda = [];
            const listaej = ejercicios.map(registro => {
                if (registro.ejercicio) {
                    listaejerciciosbusqueda.push(registro.ejercicio);
                    listaejerciciosinsertar.push(registro);
                }
            });

            const existenEjercicios = await Ejercicio.find().where('_id').in(listaejerciciosbusqueda);
            if (existenEjercicios.length != listaejerciciosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los ejercicios no existe o están repetidos'
                });
            }
        }

        rutina = new Rutina(req.body);
        rutina.ejercicios = listaejerciciosinsertar;
        await rutina.save();

        if (rolToken == "ROL_FISIO") {
            rutina.fisio_asignado = idToken;
            await rutina.save();
            fisio = await Usuario.findById(idToken);
            fisio.rutinas.push(rutina._id);
            await fisio.save();
        }


        return res.status(201).json({
            ok: true,
            msg: 'Rutina creada',
            rutina
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando rutina'
        });
    }
}

const actualizarRutina = async(req, res = response) => {


    const { ejercicios } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;

    try {

        let rutina;
        let fisio = await Usuario.findById(idToken);
        let listaejerciciosinsertar = [];

        if (ejercicios) {
            let listaejerciciosbusqueda = [];
            const listaej = ejercicios.map(registro => {
                if (registro.ejercicio) {
                    listaejerciciosbusqueda.push(registro.ejercicio);
                    listaejerciciosinsertar.push(registro);
                }
            });

            const existenEjercicios = await Ejercicio.find().where('_id').in(listaejerciciosbusqueda);
            if (existenEjercicios.length != listaejerciciosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los ejercicios no existe o están repetidos'
                });
            }
        }


        rutina = await Rutina.findByIdAndUpdate(uid, req.body, { new: true });

        rutina.ejercicios = listaejerciciosinsertar;
        await rutina.save();
        //Modificamos las rutinas del fisio
        for (var i = 0; i < fisio.rutinas.length; i++) {
            if (fisio.rutinas[i]._id == uid) {
                fisio.rutinas[i] = rutina;
                await fisio.save();
            }
        }

        //Modificamos las rutinas del cliente
        const clientes = await Cliente.find();

        for (var i = 0; i < clientes.length; i++) {
            for (var j = 0; j < clientes[i].rutinas.length; j++) {
                if (clientes[i].rutinas[j].rutina._id == uid) {
                    clientes[i].rutinas[j].rutina = rutina;
                    await clientes[i].save();
                }
            }
        }

        return res.status(200).json({
            ok: true,
            msg: 'Rutina actualizada',
            rutina
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando rutina'
        });
    }
}

// ACTUALIZAR VECES QUE SE HA REALIZADO UNA RUTINA Y TIEMPO GASTADO

const actualizarVecesTiempo = async(req, res = response) => {
    //actualizamos campos duracion y veces_realizada
    //veces_realizada se suma uno, porque si se llama a esta funcion es porque se ha realizado una vez mas la rutina

    const { tiempo } = req.body;
    const uid = req.params.id; //id de la rutina a actualizar
    const idToken = req.uidToken;

    try {
        //actualizamos la rutina en el cliente
        let cliente = await Cliente.findById(idToken);
        let aux = 0;
        for (var i = 0; i < cliente.rutinas.length; i++) {
            if (cliente.rutinas[i].rutina == uid) {
                cliente.rutinas[i].duracion.push(tiempo);
                aux = cliente.rutinas[i].veces_realizada;
                cliente.rutinas[i].veces_realizada = aux + 1;
                await cliente.save();
            }
        }

        //actualizamos los datos de la rutina en general
        aux = 0;
        let rutina = await Rutina.findById(uid);
        aux = rutina.veces_realizada;
        rutina.veces_realizada = aux + 1;
        rutina.duracion.push(tiempo);
        await rutina.save();



        return res.status(200).json({
            ok: true,
            msg: 'Datos rutina actualizada',
            rutina,
            //cliente
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando los datos de la rutina'
        });
    }
}

const obtenerFisioRutina = async(req, res = response) => {
    // obtnemos el ID de una rutina y debemos obtener al fisio que la ha creado
    const uid = req.params.id; //id de la rutina
    const idToken = req.uidToken;

    try {

        let cliente = await Cliente.findById(idToken);
        let rutina = await Rutina.findById(uid);
        let idfisio = rutina.fisio_asignado;
        var ObjectId = require('mongodb').ObjectId;
        idfisio = new ObjectId(idfisio); // wrap in ObjectID
        let clientefisio = false;

        for (var i = 0; i < cliente.listaFisios.length; i++) {
            if (cliente.listaFisios[i].equals(idfisio)) {
                clientefisio = true;
            }
        }

        if (!clientefisio) {
            return res.status(403).json({ // No encontrado, not found
                ok: false,
                msg: 'No estas autorizado para esta operación'
            });
        }

        //si todo sale bien obtenemos el fisio para devolver
        let fisio = await Usuario.findById(idfisio);
        //obtenemos el campo valoracion del cliente para su fisio
        let valoracion;
        for (var i = 0; i < fisio.listaClientes.length; i++) {
            if (fisio.listaClientes[i].cliente.equals(idToken)) {
                valoracion = fisio.listaClientes[i].valoracion;
            }
        }

        return res.status(200).json({
            ok: true,
            msg: 'Datos rutina obtenidos',
            fisio,
            valoracion
            //cliente
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniendo los datos de la rutina'
        });
    }
}

const obtenerVecesTiempo = async(req, res = response) => {
    //actualizamos campos duracion y veces_realizada
    //veces_realizada se suma uno, porque si se llama a esta funcion es porque se ha realizado una vez mas la rutina

    const { tiempo } = req.body;
    const uid = req.params.id; //id de la rutina a actualizar
    const idToken = req.uidToken;

    try {

        let cliente = await Cliente.findById(idToken);
        let duracion;
        let veces_realizada;
        for (var i = 0; i < cliente.rutinas.length; i++) {
            if (cliente.rutinas[i].rutina == uid) {
                duracion = cliente.rutinas[i].duracion;
                veces_realizada = cliente.rutinas[i].veces_realizada;
            }
        }



        return res.status(200).json({
            ok: true,
            msg: 'Datos rutina actualizada',
            duracion,
            veces_realizada
            //cliente
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando los datos de la rutina'
        });
    }
}



const eliminarRutina = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;

    try {
        // Comprobamos si existe la rutina que queremos eliminar
        const existeRutina = await Rutina.findById(uid);
        if (!existeRutina) {
            return res.status(404).json({ // No encontrado, not found
                ok: false,
                msg: 'La rutina no existe'
            });
        }

        // Lo eliminamos y devolvemos la rutina recien eliminado
        const resultado = await Rutina.findByIdAndRemove(uid);
        const fisio = await Usuario.findById(idToken);

        //Elminamos las rutinas del fisio

        for (var i = 0; i < fisio.rutinas.length; i++) {
            if (fisio.rutinas[i]._id == uid) {
                fisio.rutinas.splice(i, 1);
                await fisio.save();
            }
        }

        //Elminamos las rutinas del cliente

        const clientes = await Cliente.find();

        for (var i = 0; i < clientes.length; i++) {
            for (var j = 0; j < clientes[i].rutinas.length; j++) {
                if (clientes[i].rutinas[j].rutina._id == uid) {
                    clientes[i].rutinas.splice(j, 1);
                    await clientes[i].save();
                }
            }
        }

        return res.status(200).json({
            ok: true,
            msg: 'Rutina eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error eliminando rutina'
        });

    }
}

const agregarRutinaCliente = async(req, res = response) => {

    const uid = req.params.id; //id de la rutina
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    const idfisio = req.params.idfisio;
    const idcliente = req.query.idcliente;
    let entro = 0;
    let reprutina = 0; // para comprobar si la rutina ya está en el array y no se repita

    try {
        const compruebafisio = await Usuario.findById(idfisio);
        const compruebacliente = await Cliente.findById(idcliente);
        const existerutina = await Rutina.findById(uid);
        const fisiotoken = await Usuario.findById(idToken);
        //Comprobamos si existe la rutina
        if (!existerutina) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe la rutina'
            });
        }

        //CUANDO EL TOKEN ES UN FISIO
        if (rolToken == "ROL_FISIO") {
            //FISIO AGREGA RUTINA A CLIENTE
            if (!idfisio && idcliente) {
                entro = 4;
                //Comprobamos que el fisio este en los fisios del cliente
                let fisiocliente = 0;
                for (var i = 0; i < compruebacliente.listaFisios.length; i++) {
                    if (compruebacliente.listaFisios[i] == idToken) {
                        //Mirar si ya existe esa rutina
                        for (var i = 0; i < compruebacliente.rutinas.length; i++) {
                            if (compruebacliente.rutinas[i].rutina == uid) {
                                reprutina = 1;
                            }
                        }

                        if (reprutina == 1) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'Ya existe esa rutina'
                            });
                        }
                        fisiocliente = 1;
                        compruebacliente.rutinas.push({ rutina: uid });
                        await compruebacliente.save();
                    }
                }
                if (fisiocliente == 0) {
                    return res.status(403).json({
                        ok: false,
                        msg: 'Operación incorrecta' //Cliente no pertenece a ese fisio
                    });
                }
            }
        }



        return res.status(200).json({
            ok: true,
            msg: 'Asignamiento realizado',
            entro,
            rolToken
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error añadiendo rutina'
        });

    }
}

const quitarRutinaCliente = async(req, res = response) => { //Esta por hacer

    const uid = req.params.id; //id de la rutina
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    const idfisio = req.params.idfisio;
    const idcliente = req.query.idcliente;
    let entro = 0;

    try {
        const compruebafisio = await Usuario.findById(idfisio);
        const compruebacliente = await Cliente.findById(idcliente);
        const existerutina = await Rutina.findById(uid);
        const fisiotoken = await Usuario.findById(idToken);
        //Comprobamos si existe la rutina
        if (!existerutina) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe la rutina'
            });
        }

        //CUANDO EL TOKEN ES UN FISIO
        if (rolToken == "ROL_FISIO") {
            //FISIO DELETEA RUTINA A CLIENTE
            if (!idfisio && idcliente) {
                entro = 4;
                //Comprobamos que el fisio este en los fisios del cliente
                let fisiocliente = 0;
                for (var i = 0; i < compruebacliente.listaFisios.length; i++) {
                    if (compruebacliente.listaFisios[i] == idToken) {
                        fisiocliente = 1;
                    }
                }
                if (fisiocliente == 0) {
                    return res.status(403).json({
                        ok: false,
                        msg: 'Operación incorrecta' //Cliente no pertenece a ese fisio
                    });
                }
                for (var i = 0; i < compruebacliente.rutinas.length; i++) {
                    if (compruebacliente.rutinas[i].rutina == uid) {
                        compruebacliente.rutinas.splice(i, 1);
                        await compruebacliente.save();
                    }
                }
            }
        }



        return res.status(200).json({
            ok: true,
            msg: 'Asignamiento realizado',
            entro
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error añadiendo rutina'
        });

    }

}



module.exports = { obtenerRutinas, obtenerFisioRutina, obtenerEjerciciosRutina, obtenerVecesTiempo, crearRutina, actualizarRutina, actualizarVecesTiempo, eliminarRutina, agregarRutinaCliente, quitarRutinaCliente }