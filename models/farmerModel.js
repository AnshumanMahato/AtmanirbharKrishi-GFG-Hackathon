const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  miller: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  riceQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  }
});

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
