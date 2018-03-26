const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const DayNote = mongoose.model('DayNote')
const validator = require('validator')

function validateSignupForm (payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false
    errors.email = 'Please provide a correct email address.'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 4) {
    isFormValid = false
    errors.password = 'Password must have at least 4 characters.'
  }

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false
    errors.username = 'Please provide your username.'
  }

  if (!payload || typeof payload.firstName !== 'string' || payload.firstName.trim().length === 0) {
    isFormValid = false
    errors.firstName = 'Please provide your firstname.'
  }

  if (!payload || typeof payload.lastName !== 'string' || payload.lastName.trim().length === 0) {
    isFormValid = false
    errors.lastName = 'Please provide your lastname.'
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

function validateLoginForm (payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false
    errors.username = 'Please provide your username address.'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false
    errors.password = 'Please provide your password.'
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

function validateWeightUpdate (payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || payload.weight <= 30 || payload.weight >= 300 || !validator.isNumeric(payload.weight)) {
    isFormValid = false
    errors.weight = 'Please provide your weight in kg.'
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
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    const reqUser = req.body

    const validationResult = validateSignupForm(reqUser)
    if (!validationResult.success) {
      console.log(validationResult.errors)
      res.locals.globalError = validationResult.message
      res.render('users/register')
    }

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User
      .findOne({ username: reqUser.username })
      .then((user) => {
        if (user) {
          res.locals.globalError = 'User already exists!'
          res.render('users/register')
        }

        User
          .create({
            username: reqUser.username,
            email: reqUser.email,
            firstName: reqUser.firstName,
            lastName: reqUser.lastName,
            salt: salt,
            hashedPass: hashedPassword
          })
          .then(reg => {
            req.logIn(reg, (err, reg) => {
              if (err) {
                res.locals.globalError = err
                res.render('users/register', reg)
              }

              res.redirect('/')
            })
          })
      })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    const validationResult = validateLoginForm(reqUser)

    if (!validationResult.success) {
      console.log(validationResult.errors)
      res.locals.globalError = validationResult.message
      res.render('users/login')
      return
    }

    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  profile: (req, res) => {
    const userId = req.user._id

    DayNote
      .find({user: userId})
      .sort('-dateOriginal')
      .populate('products.product')
      .then(notes => {
        User
          .findById(req.user._id)
          .then((user) => {
            const info = {
              name: user.firstName,
              weight: user.weight
            }

            res.render('users/profile', {
              info,
              notes
            })
          })
      })
  },
  update_weight_post: (req, res) => {
    const validationResult = validateWeightUpdate(req.body)
    if (!validationResult.success) {
      console.log(validationResult.errors)
      res.locals.globalError = validationResult.message
      res.redirect('/users/profile')
      return
    }
    const { weight } = req.body

    User
      .findById(req.user._id)
      .then((user) => {
        user.weight = weight
        user.save()
        res.redirect('/users/profile')
      })
  }
}
