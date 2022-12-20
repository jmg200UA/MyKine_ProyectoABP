/*
Ruta base: /api/rutinas
*/

const { Router } = require('express');
const { obtenerRutinas, obtenerFisioRutina, obtenerEjerciciosRutina, crearRutina, actualizarRutina, actualizarVecesTiempo, eliminarRutina, agregarRutinaCliente, quitarRutinaCliente, obtenerVecesTiempo } = require('../controllers/rutinas');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolFisio } = require('../middleware/validar-rol-fisio');
const { validarRolFisioAdmin } = require('../middleware/validar-rol-fisio-admin');


const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerRutinas);

router.get('/ejr/:id', [
    validarJWT,
    //validarRolFisioAdmin,
], obtenerEjerciciosRutina);

router.get('/fr/:id', [
    validarJWT,
    //validarRolFisioAdmin,
], obtenerFisioRutina);

router.get('/ovt/:id', [
    //validarRolFisioAdmin,
], obtenerVecesTiempo);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    validarCampos,
    validarRolFisioAdmin,
], crearRutina);

router.put('/:id', [
    validarJWT,
    validarCampos,
    validarRolFisioAdmin,
], actualizarRutina);

router.put('/vt/:id', [
    validarJWT,
    check('tiempo', 'El tiempo debe ser un número').not().isEmpty().isNumeric(),
    validarCampos,
], actualizarVecesTiempo);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], eliminarRutina);

router.put('/ar/:id', [ // ar agregar rutina + ID rutina
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], agregarRutinaCliente);

router.put('/qr/:id', [ // qr quitar rutina + ID rutina
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], quitarRutinaCliente);


module.exports = router;