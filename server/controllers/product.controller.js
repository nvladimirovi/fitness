const Joi = require('joi');
const Product = require('../models/product.model');

const productSchema = Joi.object({
  name: Joi.string().max(255).alphanum().required(),
  callories: Joi.number().required().min(0),
  carbs: Joi.number().required().min(0),
  protein: Joi.number().required().min(0),
  fat: Joi.number().required().min(0)
});


module.exports = {
  getAll,
  getProductById,
  getProductByName,
  create,
  updateById,
  deleteProductById
}

async function getAll() {
  return await Product.find();
}

async function getProductById(id) {
  return await Product.findById(id);
}

async function getProductByName(name) {
  return await Product.find({name});
}

async function create(product) {
  product = await Joi.validate(product, productSchema);

  return new Product(product).save();
}

async function updateById(id, newProduct) {
  newProduct = await Joi.validate(newProduct, productSchema);

  return Product
    .findById(id)
    .then((found) => {
      if (!found) {
        return Promise.reject("There is no product with such id.");
      }

      found.name = newProduct.name;
      found.callories = newProduct.callories;
      found.carbs = newProduct.carbs;
      found.protein = newProduct.protein;
      found.fat = newProduct.fat;

      return found.save();
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

async function deleteProductById(id) {
  return Product
    .findByIdAndDelete();
}
