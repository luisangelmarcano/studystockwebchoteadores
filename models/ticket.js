const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fecha: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Ticket', TicketSchema);
