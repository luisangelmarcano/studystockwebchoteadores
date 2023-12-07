const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    rut: String,
    pass: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    carrera: String,
    telefono: String,
    correo: String,
    perfil: { type: mongoose.Schema.Types.ObjectId, ref: 'Perfil' } 
});

module.exports = mongoose.model('Usuario', usuarioSchema);
