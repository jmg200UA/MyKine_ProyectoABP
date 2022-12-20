/*
Ruta base: /api/clientes
*/

const { Router } = require('express');
const router = Router();


const { obtenerClientes, obtenerClienteChatbot, obtenerClientes2, cambiarActivoLista, cambiarActivoRutinaCliente, actualizarCliente, obtenerInformesCliente2, obtenerListaFisios, obtenerRutinas, obtenerRutinasPaginadas, crearCliente, envioReestablecerPass, cambiarPassword, actualizarPassword, borrarCliente, reestablecerPassword } = require('../controllers/clientes');

const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolFisioAdmin } = require('../middleware/validar-rol-fisio-admin');
const { validarRolFisio } = require('../middleware/validar-rol-fisio');

//Aqui se realizarán las validaciones para la gestión de los clientes

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'La busqueda debe contener texto').optional().trim(),
    validarCampos,
], obtenerClientes);

router.get('/datosclienteparachatbot/:id', [
    check('id', 'El id de usuario debe ser válido').optional().isMongoId()
], obtenerClienteChatbot);

router.get(
    "/sinlimite", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
    ],
    obtenerClientes2,
);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarCliente);

router.get(
    "/informesCliente", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
    ],
    obtenerInformesCliente2,
);

router.get(
    "/rutinasClientePaginadas", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
    ],
    obtenerRutinasPaginadas,
);

router.get(
    "/rutinasCliente", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
    ],
    obtenerRutinas,
);

router.get(
    "/listaFisios", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
    ],
    obtenerListaFisios,
);

router.post('/', [
    validarJWT,
    check('email', 'El argumento email debe ser un email').isEmail(),
    validarCampos,
    validarRolFisioAdmin,
], crearCliente);

router.post('/erp', [
    check('email', 'El argumento email debe ser un email').isEmail(),
    validarCampos,
], envioReestablecerPass);

// para establecer nombre y contraseña
router.put('/cp/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre_apellidos', 'El argumento nombre y apellidos es obligatorio').not().isEmpty().trim(),
    check('nuevopassword', 'El argumento nuevopassword es obligatorio').not().isEmpty().trim(),
    check('nuevopassword2', 'El argumento nuevopassword2 es obligatorio').not().isEmpty().trim(),
    validarCampos,
], cambiarPassword);

router.put('/rp/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    check('nuevopassword', 'El argumento nuevopassword es obligatorio').not().isEmpty().trim(),
    check('nuevopassword2', 'El argumento nuevopassword2 es obligatorio').not().isEmpty().trim(),
    validarCampos,
], reestablecerPassword);

router.put('/ca/:id', [
    validarJWT,
], cambiarActivoLista);

router.put('/carc/:id', [
    validarJWT,
], cambiarActivoRutinaCliente);

router.put('/np/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarPassword);


router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], borrarCliente);

module.exports = router;