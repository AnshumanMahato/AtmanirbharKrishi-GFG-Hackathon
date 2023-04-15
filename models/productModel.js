const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
    maxlength: [
      40,
      'A product name must have less than or equal to 40 characters'
    ]
  },
  slug: String,
  type: {
    type: String,
    enum: ['rabi', 'kharif', 'cereal'],
    require: [true, 'A product must have a type']
  },
  pricePerKg: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  imageCover: {
    type: String,
    required: [true, 'A product must have a cover image.']
  }
});

//Document Middleware: runs at save() and create()
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
