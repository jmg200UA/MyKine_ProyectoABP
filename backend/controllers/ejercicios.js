const { response } = require('express');
const validator = require('validator');

const Ejercicio = require('../models/ejercicios');
const Rutinas = require('../models/rutinas');

/*
get / 
--> devuleve todos los ejercicios
*/
const obtenerEjercicios = async(req, res = response) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";

    if (texto) {
        textoBusqueda = new RegExp(texto, "i");

    }

    // Obtenemos el ID del ejercicio por si quiere buscar solo un ejercicio
    const id = req.query.id;

    const {...object } = req.body;



    try {
        let ejercicios, total;

        if (id) {
            [ejercicios, total] = await Promise.all([
                Ejercicio.findById(id),
                Ejercicio.countDocuments(),
            ]);

            return res.status(200).json({
                ok: true,
                msg: "obtenerEjercicio",
                ejercicios,
            });

        } else {

            // Busca todos los ejercicios
            let query = {};
            if (texto) {
                query = {
                    $or: [
                        { nombre: textoBusqueda },
                        { descripcion: textoBusqueda },
                        { tipo: textoBusqueda },
                    ],
                };
            }

            [ejercicios, total] = await Promise.all([
                Ejercicio.find(query)
                .skip(desde)
                .limit(registropp)
                .collation({ locale: "es" })
                .sort({ nombre_apellidos: 1 }),
                Ejercicio.countDocuments(query),
            ]);

            return res.status(200).json({
                ok: true,
                msg: "obtenerEjercicios",
                ejercicios,
                page: {
                    desde,
                    registropp,
                    total,
                },
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniendo ejercicios'
        });
    }
}

const obtenerEjerciciosNoPag = async(req, res = response) => {


    try {
        let ejercicios, total;


        [ejercicios, total] = await Promise.all([
            Ejercicio.find(),
            Ejercicio.countDocuments(),
        ]);

        return res.status(200).json({
            ok: true,
            msg: "obtenerEjercicio",
            ejercicios,
        });




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniendo ejercicios'
        });
    }
}

const crearEjercicio = async(req, res = response) => {

    const {...object } = req.body;

    try {

        // Comprobar que no existe un ejercicio identico
        const existeEjercicioNombre = await Ejercicio.findOne({ nombre: object.nombre });
        /*const existeEjercicioTipo = '';
        const tip = '';
        for (var i = 0; i < Ejercicio.tipo.length; i++) {
            tip = Ejercicio.tipo[i];
            existeEjercicioTipo = await Ejercicio.findOne({ tip: object.tipo });
        }*/
        const existeEjercicioTipo = await Ejercicio.findOne({ tip: object.tipo });

        if (existeEjercicioNombre && existeEjercicioTipo) {
            return res.status(400).json({
                ok: false,
                msg: 'Ejercicio ya existe con el mismo nombre en el mismo tipo'
            });
        }

        if (existeEjercicioNombre && !existeEjercicioTipo) {
            return res.status(400).json({
                ok: false,
                msg: 'Ejercicio ya existe con el mismo nombre'
            });
        }


        const ejercicio = new Ejercicio(object);
        await ejercicio.save();

        return res.status(201).json({
            ok: true,
            msg: 'Ejercicio creado',
            ejercicio
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando ejercicio'
        });
    }
}

const actualizarEjercicio = async(req, res) => {

    const {...object } = req.body;
    const uid = req.params.id;
    var existe = 0;

    try {

        const ejes = await Ejercicio.find();

        for (var i = 0; i < ejes.length && existe == 0; i++) {
            if (ejes[i].nombre == object.nombre) {
                existe = 1;
            }
        }

        if (existe == 0) {
            const ejercicio = await Ejercicio.findByIdAndUpdate(uid, object, { new: true });

            return res.status(200).json({
                ok: true,
                msg: 'Ejercicio actualizado',
                ejercicio
            });
        } else {
            return res.status(500).json({
                ok: false,
                msg: 'El nombre del ejercicio ya existe'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando ejercicio'
        });
    }
}

const eliminarEjercicio = async(req, res = response) => {

    const uid = req.params.id;

    const {...object } = req.body;

    try {
        // Comprobamos si existe el ejercicio que queremos eliminar
        const existeEjercicio = await Ejercicio.findById(uid);
        if (!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }
        // Lo eliminamos y devolvemos el ejercicio recien eliminado
        const resultado = await Ejercicio.findByIdAndRemove(uid);

        const rutinas = await Rutinas.find();


        //SE TIENE QUE ELIMINAR EL EJERCICIO EN LAS RUTINAS

        for (var i = 0; i < rutinas.length; i++) {
            for (var j = 0; j < rutinas[i].ejercicios.length; j++) {
                if (rutinas[i].ejercicios[j] == uid) {
                    rutinas[i].ejercicios.splice(j, 1);
                    await rutinas[i].save();
                }
            }
        }



        return res.status(200).json({
            ok: true,
            msg: 'Ejercicio eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error eliminando ejercicio'
        });

    }
}



module.exports = { obtenerEjercicios, obtenerEjerciciosNoPag, crearEjercicio, actualizarEjercicio, eliminarEjercicio }