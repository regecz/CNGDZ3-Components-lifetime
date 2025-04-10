const mongoose = require('mongoose');
const User = require('./User');

const componentSchema = new mongoose.Schema({
    compName: { type: String, required: true, unique: true },
    compType: { type: String, required: true },
    brand: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },
    serial: { type: String, required: false },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Component', componentSchema);
