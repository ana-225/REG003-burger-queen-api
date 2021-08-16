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
  },

  imagen: {
    type: String,
  },

  type: {
    type: String,
  }

});

module.exports = model('Product', productSchema);