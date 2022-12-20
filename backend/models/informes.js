const { Schema, model } = require('mongoose');

const InformeSchema = Schema({
    fisio_asociado: {
        type: Schema.Types.ObjectId,
        ref: "Fisio",
        require: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    titulo: {
        type: String,
        require: true,
    },
    contenido: {
        type: String,
        require: true,
    },
    cliente_asociado: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
        require: true,
    },
}, { collection: "informes" });

InformeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Informe', InformeSchema);