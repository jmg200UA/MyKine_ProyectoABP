/*
Ruta base: /api/informes
*/

const { Router } = require('express');
const { obtenerInformes, crearInforme, eliminarInforme, actualizarInforme } = require('../controllers/informes');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolFisio } = require('../middleware/validar-rol-fisio');


const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
], obtenerInformes);

router.put('/:id', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('contenido', 'El argumento contenido es obligatorio').not().isEmpty().trim(),
    validarRolFisio,
], actualizarInforme);

router.post('/', [
    validarJWT,
    check('contenido', 'El argumento contenido es obligatorio').not().isEmpty().trim(),
    validarCampos,
    validarRolFisio,
], crearInforme);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisio,
], eliminarInforme);


module.exports = router;