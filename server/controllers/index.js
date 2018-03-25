const home = require('./home-controller')
const users = require('./users-controller')
const cars = require('./cars-controller')
const daynote = require('./daynote-controller')
const product = require('./product-controller')

module.exports = {
  home: home,
  users: users,
  cars: cars,
  daynote: daynote,
  product: product
}
