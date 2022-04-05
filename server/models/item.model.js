const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  userId: mongoose.ObjectId
})

const dbConnection = require('../controllers/db.controller');
const Item = dbConnection.model('Item', itemSchema);

module.exports = itemSchema
module.exports.model = Item