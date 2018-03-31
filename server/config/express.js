const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const handlebars = require('express-handlebars')
const helmet = require('helmet')
const csrf = require('csurf') // Cross-site Request Forgery Protection
const encrypt = require('../utilities/encryption')
const RateLimit = require('express-rate-limit')

module.exports = (app) => {
  app.engine('handlebars', handlebars({
    defaultLayout: 'main'
  }))
  app.set('view engine', 'handlebars')
  app.use(helmet()) // Security
  app.use(cookieParser())
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  app.use(session({
    secret: encrypt.generateSalt(),
    cookie: {
      maxAge: 2628000000,
      secure: 'auto'
    },
    resave: false,
    saveUninitialized: false,
    httpOnly: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(csrf()) // Cross-site Request Forgery Protection
  app.use(new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
  }))

  app.use((req, res, next) => {
    // console.log(req.session.passport)
    if (req.user) {
      res.locals.currentUser = req.user
      res.locals.isAdmin = req.user.roles.indexOf('Admin') >= 0
    }
    res.locals._csrf = req.csrfToken()

    next()
  })

  app.use(express.static('public')) // Set static folder

  console.log('Express ready!')
}
