const {
  Schema,
  model
} = require('mongoose')

const orderSchema = new Schema({

  id: {
    type: String,
    required: true,
    unique: true,
  },

  client: {
    type: String,
    required: true,
  },

  product: [{
    qty: {
      type: Number,
      required: true,
    },
  }],
});

module.export = model('Order', orderSchema)

//STATUS, DATEENTRY