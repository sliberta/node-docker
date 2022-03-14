const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username should be provided.'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password should be provided.']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
