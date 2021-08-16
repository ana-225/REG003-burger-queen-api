const {
  Schema,
  model,
  Mongoose
} = require('mongoose')

const orderSchema = new Schema({


  id: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: String
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
      type: Mongoose.Schema.Types.ObjectId,
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

module.exports = model('Order', orderSchema)