const mongoose = require('mongoose')
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let productSchema = new mongoose.Schema({
    product: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
    callories: {type: Number, required: REQUIRED_VALIDATION_MESSAGE},
    carbs: {type: Number, required: REQUIRED_VALIDATION_MESSAGE},
    protein: {type: Number, required: REQUIRED_VALIDATION_MESSAGE},
    fat: {type: Number, required: REQUIRED_VALIDATION_MESSAGE}
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
