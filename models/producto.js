const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombreproducto: String,
    categoria: String,
    detalle: String,
    autor: String,
    editorial: String,
    imagen: String
});

module.exports = mongoose.model('Producto', productoSchema);
