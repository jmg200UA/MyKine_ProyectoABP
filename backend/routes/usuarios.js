/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { obtenerUsuarios, obtenerUsuarioToken, obtenerUsuarios2, obtenerListaClientes, obtenerPremiums, obtenerPremiumsPaginados, obtenerInformesFisio, crearUsuario, actualizarUsuario, actualizarPlan, borrarUsuario, actualizarPassword, actualizarValoracionFisio } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');
const { validarRol } = require('../middleware/validar-rol');
const { validarRolFisioAdmin } = require('../middleware/validar-rol-fisio-admin');
const { validarRolFisio } = require('../middleware/validar-rol-fisio');

const router = Router();


router.get(
    "/", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
        validarRolFisioAdmin,
    ],
    obtenerUsuarios,
);

router.get(
    "/ut", [
        validarJWT,
        validarRolFisioAdmin,
    ],
    obtenerUsuarioToken,
);

router.get(
    "/sinlimite", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
        validarRolFisioAdmin,
    ],
    obtenerUsuarios2,
);

router.get(
    "/listaClientes", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
        validarRolFisio,
    ],
    obtenerListaClientes,
);

router.get(
    "/informesFisio", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
        validarRolFisio,
    ],
    obtenerInformesFisio,
);

router.get(
    "/premiums", [
        validarCampos,
    ],
    obtenerPremiums,
);

router.get(
    "/premiumsPaginados", [
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
    ],
    obtenerPremiumsPaginados,
);



router.post('/', [
    validarJWT,
    check('nombre_apellidos', 'El argumento nombre_apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
    validarRolAdmin,
    validarRol,
], crearUsuario);

router.put('/vf', [
    validarJWT,
], actualizarValoracionFisio);

router.put('/:id', [
    validarJWT,
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarUsuario);

router.put('/apm/:id', [
    validarJWT,
    validarRolFisioAdmin,
], actualizarPlan);

router.put('/np/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarPassword);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin,
], borrarUsuario);


module.exports = router;