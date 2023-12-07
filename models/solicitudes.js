const mongoose = require('mongoose');

const estadosEnum = ['aprobada', 'rechazado', 'pendiente'];

const solicitudSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  estado: String,
  fechaDevuelta: { type: Date, default: null }});

module.exports = mongoose.model('Solicitud', solicitudSchema);
