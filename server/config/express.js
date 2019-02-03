const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const helmet = require('helmet')
const csrf = require('csurf') // Cross-site Request Forgery Protection
const encrypt = require('../utilities/encryption')
const RateLimit = require('express-rate-limit')
const path = require('path')

module.exports = (app) => {
	// View Engines
	app.set('views', path.join(__dirname, '../../views'))
	app.set('view engine', 'ejs')
	app.engine('html', require('ejs').renderFile)

	app.use(bodyParser.json()) // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

	app.use(cookieParser())

	app.use(helmet()) // Security
	
	app.use(csrf({ cookie: true }))
	app.use(function (req, res, next) {
		res.cookie('XSRF-TOKEN', req.csrfToken())
		return next()
	})

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

	app.use(new RateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		delayMs: 0 // disable delaying - full speed until the max limit is reached
	}))

	app.use(express.static('views/home')) // Set static folder

	console.log('Express ready!')
}
