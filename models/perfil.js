const mongoose = require('mongoose');

const perfilSchema = new mongoose.Schema({
    nombre: String,
    permisos: [String]
});

module.exports = mongoose.model('Perfil', perfilSchema);