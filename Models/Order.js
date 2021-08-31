const { Schema, model } = require('mongoose');
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
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  }],
  status: {
    type: String,
    default: 'pending',
    required: true,
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
