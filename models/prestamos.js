const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema({
  solicitud: { type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' },
});

module.exports = mongoose.model('Prestamo', prestamoSchema);
