const mongoose = require('mongoose');

// definition of schema
const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  money: {
    type: Number,
    default: 200,
  },
});

module.exports = userSchema;

// model
const dbConnection = require('../controllers/db.controller');
const User = dbConnection.model('User', userSchema);

module.exports.model = User;