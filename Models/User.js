const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    select: false,
  },

  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
});

userSchema.plugin(mongoosePaginate);
module.exports = model('User', userSchema);
