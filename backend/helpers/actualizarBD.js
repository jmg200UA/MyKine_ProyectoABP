const Usuario = require('../models/usuarios');
const Cliente = require('../models/clientes');
const fs = require('fs');
const { infoToken } = require('../helpers/infotoken');

const actualizarBD = async(tipo, path, nombreArchivo, id, token) => {
    switch (tipo) {
        case "fotoperfil":
            const usuario = await Usuario.findById(id);
            const cliente = await Cliente.findById(id); // comprobamos tambien para el caso de los clientes..
            if (!usuario && !cliente) { // usuario no existe
                return false;
            }

            // Comprobar que el id de usuario que actualiza es el mismo id del token
            // solo el usuario puede cambiar su foto
            if (infoToken(token).uid !== id) { // usuario que actualiza no es el propietario de la foto
                return false;
            }

            //hacemos el caso de que sea un usuario quien actualice
            if (usuario) {
                const fotoVieja = usuario.imagen;
                const pathFotoVieja = `${path}/${fotoVieja}`;
                if (fotoVieja && fs.existsSync(pathFotoVieja)) {
                    fs.unlinkSync(pathFotoVieja);
                }

                usuario.imagen = nombreArchivo;
                await usuario.save();
            } else if (cliente) { // hacemos el caso de que sea un cliente quien actualice
                const fotoVieja = cliente.imagen;
                const pathFotoVieja = `${path}/${fotoVieja}`;
                if (fotoVieja && fs.existsSync(pathFotoVieja)) {
                    fs.unlinkSync(pathFotoVieja);
                }

                cliente.imagen = nombreArchivo;
                await cliente.save();
            }



            return true;

            break;

        case "ejercicio":
            //Comprobar que el usuario que vaya a actualizar la foto sea un admin,
            //ya que es el unico que tiene permiso para esto
            return false;
            break;

        case "rutina":
            //Comprobar que la rutina que se esté actualizando sea del propio fisio
            //o se trate de un admin
            break;

        default:
            return false;
            break;
    }

}

module.exports = { actualizarBD }