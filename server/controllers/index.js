const home = require('./home-controller')
const users = require('./users-controller')
const daynote = require('./daynote-controller')
const product = require('./product-controller')

module.exports = {
  home: home,
  users: users,
  daynote: daynote,
  product: product
}
