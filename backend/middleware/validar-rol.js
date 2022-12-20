const { response } = require('express');
const rolesPermitidos = ['ROL_FISIO', 'ROL_ADMIN', 'ROL_CLIENTE'];

const validarRol = (req, res = response, next) => {

    const rol = req.body.rol;

    if (rol && !rolesPermitidos.includes(rol)) {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_FISIO, ROL_ADMIN, ROL_CLIENTE'
        });
    }
    next();
}

module.exports = { validarRol }