const mongoose = require('mongoose');

const millerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  min_qty: {
    type: Number,
    default: 0
  },
  mill_charge: {
    type: Number,
    required: [true, 'A Miller must have milling charges']
  },
  storage_charge: {
    type: Number,
    required: [true, 'A Miller must have milling charges']
  },
  delivery_charge: {
    type: Number,
    required: [true, 'A Miller must have milling charges']
  }
});

const Miller = mongoose.model('Miller', millerSchema);

module.exports = Miller;
