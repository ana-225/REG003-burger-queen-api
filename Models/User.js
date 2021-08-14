//crear esquema (estructura de los datos)  usuarios- productos   - orden 
const {
  Schema,
  model
} = require('mongoose')

const userSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },

});

module.export = model('User', userSchema);