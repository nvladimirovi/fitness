const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const errorHandler = require('../utilities/error-handler')

function validateProductReqBody (payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.product !== 'string' || payload.product.trim().length === 0) {
    isFormValid = false
    errors.product = 'Please select valid product name.'
  }

  if (!payload || payload.callories <= 0) {
    isFormValid = false
    errors.callories = 'Please provide valid number which is greather then 0.'
  }

  if (!payload || payload.carbs <= 0) {
    isFormValid = false
    errors.carbs = 'Please provide valid number which is greather then 0.'
  }

  if (!payload || payload.protein <= 0) {
    isFormValid = false
    errors.protein = 'Please provide valid number which is greather then 0.'
  }

  if (!payload || payload.fat <= 0) {
    isFormValid = false
    errors.fat = 'Please provide valid number which is greather then 0.'
  }

  if (!isFormValid) {
    message = 'Check the form for errors.'
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

module.exports = {
  create_get: (req, res) => {
    res.render('product/create')
  },
  create_post: (req, res) => {
    const validationResult = validateProductReqBody(req.body)
    if (!validationResult.success) {
      console.log(validationResult.errors)
      res.locals.globalError = validationResult.message
      res.render('product/create', req.body)
      return
    }

    let {
      product,
      callories,
      carbs,
      protein,
      fat
    } = req.body

    Product
      .create({
        product: product,
        callories: callories,
        carbs: carbs,
        protein: protein,
        fat: fat
      })
      .then(() => {
        res.locals.success = 'The product was successfully created.'
        res.render('product/create')
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('product/create', req.body)
      })
  },
  read_get: (req, res) => {
    const pageSize = 3
    let page = parseInt(req.query.page) || 1
    let search = req.query.search

    let query = Product.find({})

    if (search) query = query.where('product').regex(new RegExp(search, 'i'))

    query
      .sort('product')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then((products) => {
        res.render('product/all', {
          products,
          hasPrevPage: page > 1,
          hasNextPage: (page + 1) < products.length,
          prevPage: page - 1,
          nextPage: page + 1,
          search: search
        })
      })
  },
  update_get: (req, res) => {
    Product
      .findById(req.params.id)
      .then((product) => {
        res.render('product/update', {
          product
        })
      })
  },
  update_post: (req, res) => {
    const validationResult = validateProductReqBody(req.body)
    if (!validationResult.success) {
      console.log(validationResult.errors)
      res.locals.globalError = validationResult.message
      res.render('product/create', req.body)
      return
    }

    Product
      .findById(req.params.id)
      .then((currentProduct) => {
        const { product, callories, carbs, protein, fat } = req.body

        if (currentProduct.product !== product) currentProduct.product = product

        if (currentProduct.callories !== callories) currentProduct.callories = callories

        if (currentProduct.carbs !== carbs) currentProduct.carbs = carbs

        if (currentProduct.protein !== protein) currentProduct.protein = protein

        if (currentProduct.fat !== fat) currentProduct.fat = fat

        currentProduct
          .save()
          .then((currentProduct) => {
            res.redirect('/product/update/' + currentProduct._id)
          })
          .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.render('product/create', req.body)
          })
      })
  },
  delete: (req, res) => {
    Product
      .findOne({_id: req.params.id})
      .then((product) => {
        product
          .remove({_id: product._id})
          .then(() => {
            res.redirect('/product/all')
          })
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/product/all')
      })
  }
}
