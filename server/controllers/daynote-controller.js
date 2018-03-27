const mongoose = require('mongoose')
const DayNote = mongoose.model('DayNote')
const User = mongoose.model('User')
const Product = mongoose.model('Product')
const errorHandler = require('../utilities/error-handler')
const math = require('../utilities/math')

function validateCreateDayNote (payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || payload.weight <= 10 || payload.weight >= 2000) {
    isFormValid = false
    errors.weight = 'Please provide valid number which is greather then 10 or less then 2000.'
  }

  if (!payload || typeof payload.product !== 'string' || payload.product.trim().length === 0) {
    isFormValid = false
    errors.product = 'Please select valid product name.'
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
    Product
      .find({})
      .sort('product')
      .then((products) => {
        res.render('daynote/create', { products })
      })
  },
  create_post: (req, res) => {
    const validationResult = validateCreateDayNote(req.body)
    if (!validationResult.success) {
      console.log(validationResult.errors)
      res.locals.globalError = validationResult.message
      Product
        .find({})
        .sort('product')
        .then((products) => {
          res.render('daynote/create', { products })
        })
      return
    }

    const dayNoteReq = req.body
    const currentUserId = req.user._id
    const weight = parseInt(dayNoteReq.weight)
    const newDate = new Date()
    const date = newDate.getDate()
    const month = newDate.getMonth()
    const year = newDate.getFullYear()

    User
      .findById(currentUserId)
      .then((user) => {
        DayNote
          .findOne({ user: currentUserId, date, month, year })
          .then((note) => {
            if (note) {
              Product
                .findOne({ product: dayNoteReq.product })
                .then((product) => {
                  let { callories, carbs, protein, fat } = note.total

                  note
                    .products.push({
                      product: product._id, weight
                    })

                  note.total = {
                    weight: note.total.weight + weight,
                    callories: parseInt(callories + (product.callories / 100) * weight),
                    carbs: math.roundTo((carbs + ((product.carbs / 100) * weight)), 2),
                    protein: math.roundTo((protein + ((product.protein / 100) * weight)), 2),
                    fat: math.roundTo((fat + ((product.fat / 100) * weight)), 2)
                  }

                  note
                    .save()
                    .then(() => {
                      res.redirect('/daynote/create')
                    })
                })
            } else {
              Product
                .findOne({ product: dayNoteReq.product })
                .then((product) => {
                  const newNote = {
                    dateOriginal: newDate,
                    date,
                    month,
                    year,
                    user: user._id,
                    products: [{
                      product: product._id,
                      weight: dayNoteReq.weight
                    }],
                    total: {
                      weight,
                      callories: parseInt((product.callories / 100) * weight),
                      carbs: math.roundTo(((product.carbs / 100) * weight), 2),
                      protein: math.roundTo(((product.protein / 100) * weight), 2),
                      fat: math.roundTo(((product.fat / 100) * weight), 2)
                    }
                  }

                  DayNote
                    .create(newNote)
                    .then((note) => {
                      res.redirect('/daynote/create')
                    })
                })
                .catch((err) => {
                  let message = errorHandler.handleMongooseError(err)
                  res.locals.globalError = message
                  res.render('daynote/create')
                })
            }
          })
      })
  },
  update_note_get: (req, res) => {},
  update_note_post: (req, res) => {},
  delete_product: (req, res) => {
    const noteId = req.params.note
    const productToDelById = req.params.product

    DayNote
      .findOne({ _id: noteId })
      .populate('products.product')
      .then((note) => {
        note.products.id(productToDelById).remove()
        note.calcTotal()
        note
          .save()
          .then((note) => {
            res.redirect('/users/profile')
          })
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('users/profile')
      })
  },
  delete_note: (req, res) => {
    const postToDel = req.params.id

    DayNote
      .findById(postToDel)
      .then((note) => {
        note.remove({ _id: note._id })
        res.redirect('/users/profile')
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('users/profile')
      })
  }
}
