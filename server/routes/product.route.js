const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const productCtrl = require('../controllers/product.controller');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

// Create new product
router.route('/')
  .post(asyncHandler(create))

// Get all products
router.route('/')
  .get(asyncHandler(getAll));

// Get product by query parameters
// Support:
// - By name
router.route('/query')
  .get(asyncHandler(getProductByName))

// Get product by id
router.route('/:id')
  .get(asyncHandler(getProductById))

// Update product by id
router.route('/:id')
  .put(asyncHandler(updateProductById))

// Delete product by id
router.route('/:id')
  .delete(asyncHandler(deleteProductById))

async function getAll(req, res) {
  let allProducts = await productCtrl.getAll();
  res.json(allProducts);
}

async function getProductById(req, res) {
  const id = req.params.id;
  let product = await productCtrl.getProductById(id);
  res.json(product);
}

async function updateProductById(req, res) {
  productCtrl.updateById(req.params.id, req.body)
    .then((updatedProduct) => {
      res.json(updatedProduct);
    })
    .catch((err) => {
      res.status(400).json(err.message || err)
    });
}

async function deleteProductById(req, res) {
  productCtrl.deleteProductById(req.params.id)
    .then(() => {
      res.end();
    })
    .catch((err) => {
      res.status(400).json(err.message || err)
    });
}

async function getProductByName(req, res) {
  const { name } = req.query;
  let products = await productCtrl.getProductByName(name);
  res.json(products);
}

async function create(req, res) {
  console.log(req.body);
  productCtrl.create(req.body)
    .then((newProduct) => {
      res.json(newProduct);
    })
    .catch((err) => {
      res.status(400).json(err.message || err);
    });
}
