const {
  Schema,
  model
} = require('mongoose')

const productSchema = new Schema({

  name: {
    type: String,
    required: true,
    unique: true,
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },

  imagen: {
    type: String,
  },

  type: {
    type: String,
  }
});

module.export = model('Product', productSchema);