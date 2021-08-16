//crear esquema (estructura de los datos)  usuarios- productos   - orden 
const {
  Schema,
  model,
  Mongoose
} = require('mongoose')

const userSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
});
//  userSchema.plugin(loadedAtPlugin)

module.exports = model('User', userSchema);