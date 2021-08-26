const { Schema, model } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

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

  image: {
    type: String,
  },

  type: {
    type: String,
  },

  dateEntry: {
    type: Date,
    default: new Date(),
  },

});

productSchema.plugin(mongoosePaginate);
module.exports = model('Product', productSchema);
