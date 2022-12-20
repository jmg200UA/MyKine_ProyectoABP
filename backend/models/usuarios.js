const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    //Campos comunes
    nombre_apellidos: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    imagen: {
        type: String,
    },
    rol: {
        type: String,
        require: true,
    },
    alta: {
        type: Date,
        default: Date.now,
    },
    activo: {
        type: Boolean,
        default: true,
    },
    valoracion: {
        type: Number,
        default: 0
    },

    //Metodos Fisio

    planMensual: {
        type: String,
    },
    num_clientes: {
        type: Number,
        default: 0
    },
    rutinas: [{
        type: Schema.Types.ObjectId,
        ref: "Rutina"
    }, ],
    sitio_Fisio: {
        nombre_sitio: {
            type: String,
            default: ''
        },
        imagen_sitio: {
            type: String
        },
        localizacion_sitio: {
            type: String,
        }
    },
    tarjeta_Fisios: {
        nombre_tarjeta: {
            type: String,
            default: ''
        },
        numero_tarjeta: {
            type: Number,
        },
        fechaCaducidad_tarjeta: {
            type: Date,
        },
        cvv: {
            type: Number,
        }
    },
    listaClientes: [{
        cliente: {
            type: Schema.Types.ObjectId,
            ref: "Cliente"
        },
        activo: {
            type: Boolean,
            default: true,
        },
        valoracion: { // valoracion del cliente a su fisio
            type: Number,
            default: 0
        }

    }],
    especialidad: {
        type: String,
    },

}, { collection: "usuarios" });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);