const { response } = require('express');
const validator = require('validator');

const Estadisticas = require('../models/estadisticas');
const { actualizarEstadisticasHelp } = require('../helpers/compruebaEstadisticas');

/*
get / 
--> devuelve todas las estadisticas
*/
const obtenerEstadisticas = async(req, res = response) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtencion ID para busqueda por ID
    const id = req.query.id;
    const num_total_personas = req.query.num_total_personas;
    const num_usuarios = req.query.num_usuarios;
    const num_fisios = req.query.num_fisios;
    const plan_mensual_gratis = req.query.plan_mensual_gratis;
    const plan_mensual_estandar = req.query.plan_mensual_estandar;
    const plan_mensual_premium = req.query.plan_mensual_premium;
    const num_visitas = req.query.num_visitas; // por implementar

    try {
        actualizarEstadisticasHelp();
        let estadisticas, total;
        if (id) {

            [estadisticas, total] = await Promise.all([
                Estadisticas.findById(id),
                Estadisticas.countDocuments()
            ]);
        } else if (num_total_personas) {
            [estadisticas] = await Promise.all([
                Estadisticas.findById(num_total_personas)
            ]);
        } else if (num_usuarios) {
            [estadisticas] = await Promise.all([
                Estadisticas.findById(num_usuarios)
            ]);
        } else if (num_fisios) {
            [estadisticas] = await Promise.all([
                Estadisticas.findById(num_fisios)
            ]);
        } else if (plan_mensual_gratis) {
            [estadisticas] = await Promise.all([
                Estadisticas.findById(plan_mensual_gratis)
            ]);
        } else if (plan_mensual_estandar) {
            [estadisticas] = await Promise.all([
                Estadisticas.findById(plan_mensual_estandar)
            ]);
        } else if (plan_mensual_premium) {
            [estadisticas] = await Promise.all([
                Estadisticas.findById(plan_mensual_premium)
            ]);
        } else if (num_visitas) {
            [estadisticas] = await Promise.all([
                Estadisticas.findById(num_visitas)
            ]);
        } else {
            [estadisticas, total] = await Promise.all([
                Estadisticas.find({}).skip(desde).limit(registropp),
                Estadisticas.countDocuments()
            ]);
        }

        return res.status(200).json({
            ok: true,
            msg: 'obtenerEstadisticas',
            estadisticas,
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
            msg: 'Error obteniendo estadisticas'
        });
    }
}

/*
post / 
crear estadisticas
*/
const crearEstadisticas = async(req, res = response) => {

    try {

        const estadisticas = new Estadisticas();
        estadisticas.nombre = "admin";

        // Almacenar en BD
        await estadisticas.save();

        res.status(201).json({
            ok: true,
            msg: 'Estadisticas creadas',
            estadisticas
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando estadisticas'
        });
    }
}

/*
put / 
actualizar estadisticas
*/
const actualizarEstadisticas = async(req, res = response) => {

    try {

        res.status(201).json({
            ok: true,
            msg: 'Estadisticas creadas',
            estadisticas
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando estadisticas'
        });
    }
}

module.exports = { obtenerEstadisticas, crearEstadisticas, actualizarEstadisticas }