const { Schema, model } = require('mongoose');

const EjercicioSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    tipo: ['Cabeza', 'Torso', 'Brazo', 'Pierna'],
    subtipo: ['Cuello', 'Cervicales', 'Hombro', 'Pecho', 'Abdomen',
        'Lumbares', 'Dorsales', 'Pelvis', 'Gluteos', 'Triceps', 'Biceps',
        'Codo', 'Antebrazo', 'Mano', 'Isquiotibiales', 'Cuadriceps', 'Rodilla', 'Tobillo', 'Muñeca', 'Pie', 'Soleo', 'Gemelos'
    ]

}, { collection: 'ejercicios' });

EjercicioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Ejercicio', EjercicioSchema);