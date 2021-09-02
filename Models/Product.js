const { Schema, model } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({

  name: {
    type: String,
  },

  price: {
    type: Number,
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
