const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Order must have a product!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a User!']
  },
  shipping_address: {
    city: String,
    country: String,
    line1: String,
    line2: String,
    state: String,
    postal_code: Number
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  price: {
    type: Number,
    require: [true, 'Order must have a price.']
  },
  paid: {
    type: Boolean,
    default: true
  }
});

orderSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'Product',
    select: 'name'
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
