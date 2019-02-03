const router = require('express').Router()
const controllers = require('../controllers')

router.post('/users/login', controllers.users.loginPost)

module.exports = router