const mongoose = require('mongoose');
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: REQUIRED_VALIDATION_MESSAGE
  },
  callories: {
    type: Number,
    required: REQUIRED_VALIDATION_MESSAGE
  },
  carbs: {
    type: Number,
    required: REQUIRED_VALIDATION_MESSAGE
  },
  protein: {
    type: Number, required: REQUIRED_VALIDATION_MESSAGE
  },
  fat: {
    type: Number,
    required: REQUIRED_VALIDATION_MESSAGE
  }
});

module.exports = mongoose.model('Product', ProductSchema);