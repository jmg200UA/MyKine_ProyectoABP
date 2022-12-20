const Usuario = require('../models/usuarios');
const Cliente = require('../models/clientes');
const estadisticas = require('../models/estadisticas');

//Middleware para manejar de forma más óptima el recuento de estadísticas
//con funciones que hacen consultas a la BD
//En cada metodo haremos recuento y actualización de cada campo
//POr ultimo un metodo general donde se actualizan todos los campos de estadisticas

const numUsuarios = async() => {
    let total = await Cliente.countDocuments();
    if (!total) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    const estadisticasAdmin = await estadisticas.findOne({ "nombre": "admin" });
    if (!estadisticasAdmin) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    total = 0 + total;
    const estAdmin = await estadisticas.findById(estadisticasAdmin._id);
    estAdmin.numUsuarios = total;
    await estAdmin.save();
    total = 0 + total;
    return total;
}

const numFisios = async() => {
    let total = await Usuario.find({ "rol": "ROL_FISIO" }).countDocuments();
    if (!total) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    const estadisticasAdmin = await estadisticas.findOne({ "nombre": "admin" });
    if (!estadisticasAdmin) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    total = 0 + total;
    const estAdmin = await estadisticas.findById(estadisticasAdmin._id);
    estAdmin.numFisios = total;
    await estAdmin.save();
    return total;
}

const numTotalPersonas = async() => {
    let total = numUsuarios() + numFisios();
    if (!total) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    const estadisticasAdmin = await estadisticas.findOne({ "nombre": "admin" });
    if (!estadisticasAdmin) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    total = 0 + total;
    const estAdmin = await estadisticas.findById(estadisticasAdmin._id);
    estAdmin.numTotoalPersonas = total;
    await estAdmin.save();
    return total;
}

const planMensualGratis = async() => {
    let total = await Usuario.find({ "planMensual": "Gratis" }).countDocuments();
    if (!total) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    total = 0 + total;
    const estadisticasAdmin = await estadisticas.findOne({ "nombre": "admin" });
    if (!estadisticasAdmin) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    const estAdmin = await estadisticas.findById(estadisticasAdmin._id);
    estAdmin.planMensualGratis = total;
    await estAdmin.save();
    return total;
}

const planMensualEstandar = async() => {
    let total = await Usuario.find({ "planMensual": "Estandar" }).countDocuments();
    if (!total) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    total = 0 + total;
    const estadisticasAdmin = await estadisticas.findOne({ "nombre": "admin" });
    if (!estadisticasAdmin) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    const estAdmin = await estadisticas.findById(estadisticasAdmin._id);
    estAdmin.planMensualEstandar = total;
    await estAdmin.save();
    return total;
}

const planMensualPremium = async() => {
    let total = await Usuario.find({ "planMensual": "Premium" }).countDocuments();
    if (!total) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    total = 0 + total;
    const estadisticasAdmin = await estadisticas.findOne({ "nombre": "admin" });
    if (!estadisticasAdmin) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    const estAdmin = await estadisticas.findById(estadisticasAdmin._id);
    estAdmin.planMensualPremium = total;
    await estAdmin.save();
    return total;
}

const actualizarEstadisticasHelp = async() => {
    const estadisticasAdmin = await estadisticas.findOne({ "nombre": "admin" });
    if (!estadisticasAdmin) {
        console.log(
            "las estadisticas no existen"
        );
        return false;
    }
    numUsuarios();
    numFisios();
    numTotalPersonas();
    planMensualGratis();
    planMensualEstandar();
    planMensualPremium();


}



module.exports = { numTotalPersonas, numUsuarios, numFisios, planMensualGratis, planMensualEstandar, planMensualPremium, actualizarEstadisticasHelp }