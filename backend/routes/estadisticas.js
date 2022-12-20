/*
Ruta base: /api/estadisticas
*/

const { Router } = require('express');
const { obtenerEstadisticas, crearEstadisticas, actualizarEstadisticas } = require('../controllers/estadisticas');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');


const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
    validarRolAdmin
], obtenerEstadisticas);

router.post('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    validarCampos,
    validarRolAdmin
], crearEstadisticas);

router.put('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    validarRolAdmin
], actualizarEstadisticas);


module.exports = router;