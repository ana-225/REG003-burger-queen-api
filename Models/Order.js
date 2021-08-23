const mongoose = require ('mongoose')
const {
  Schema,
  model,
  
} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new Schema({

  userId: {
    type: String,
  },

  client: {
    type: String,
    required: true,

  },

  products: [{
    qty: {
      type: Number,
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  }],
  status: {
    type: String,
    default: 'Pending',
    required: true,
  },
  dateEntry: {
    type: Date,
    default: Date.now,
    required: true,
  },

  dateProcessed: {
    type: Date,
    default: Date.now,
    required: true,
  },

});
orderSchema.plugin(mongoosePaginate);
module.exports = model('Order', orderSchema);

