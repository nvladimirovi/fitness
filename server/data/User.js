const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  username: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  email: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  firstName: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  lastName: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  weight: { type: Number },
  salt: String,
  hashedPass: String,
  roles: [String]
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length > 0) return

    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, 'qwedcxzaq1')

    User.create({
      username: 'webmaster',
      email: 'nikiviliev98@gmail.com',
      firstName: 'Webmaster',
      lastName: 'Webmaster',
      salt: salt,
      hashedPass: hashedPass,
      roles: ['Admin']
    })
  })
}
