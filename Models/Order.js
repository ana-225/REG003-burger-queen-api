const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new Schema({
  userId: {
    type: String,
  },

  client: {
    type: String,
  },

  products: [
    {
      qty: {
        type: Number,
      },

      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    },
  ],
  status: {
    type: String,
    default: 'Pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },

  dateProcessed: {
    type: Date,
    default: Date.now,
  },
});
orderSchema.plugin(mongoosePaginate);
module.exports = model('Order', orderSchema);
