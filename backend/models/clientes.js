const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({
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
    alta: {
        type: Date,
        default: Date.now,
    },
    listaFisios: [{
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    }, ],
    rutinas: [{
        rutina: {
            type: Schema.Types.ObjectId,
            ref: "Rutina",
        },
        activo: {
            type: Boolean,
            default: true,
        },
        duracion: [{
            type: Number,
            default: []
        }],
        veces_realizada: {
            type: Number,
            default: 0
        },
        fecha: {
            type: Date,
            default: Date.now,
        }
    }, ],
    informes: [{
        type: Schema.Types.ObjectId,
        ref: "Informe",
    }, ],
    activo: {
        type: Boolean,
        default: true
    },
    rol: {
        type: String,
        default: "ROL_CLIENTE", // rol estatico
    },
}, { collection: "clientes" });

ClienteSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Cliente', ClienteSchema);