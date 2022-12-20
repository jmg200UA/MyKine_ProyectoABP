const { Schema, model } = require('mongoose');

const RutinaSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
        require: true
    },
    ejercicios: [{
        ejercicio: {
            type: Schema.Types.ObjectId,
            ref: 'Ejercicio'
        },
        repeticiones: {
            type: Number
        }
    }],
    fisio_asignado: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    activa: {
        type: Boolean,
        default: true
    },
    duracion: [{
        type: Number,
        default: []
    }],
    veces_realizada: {
        type: Number,
        default: 0
    }

}, { collection: 'rutinas' });

RutinaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Rutina', RutinaSchema);