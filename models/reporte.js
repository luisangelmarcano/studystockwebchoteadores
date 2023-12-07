const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo' }],
    producto: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }],
    usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    stockDisponible: Number,
    stockNoDisponible: Number,
    productoMasSolicitado: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    productoMenosSolicitado: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    devolucionesFueraDePlazo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo' }],
    productosConPerdidas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }]
});

module.exports = mongoose.model('Reporte', reporteSchema);
   