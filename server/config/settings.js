const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://nikiviliev:cdeszaq1@ds121889.mlab.com:21889/fitness',
    port: 1337
  },
  staging: {
  },
  production: { 
    port: process.env.PORT
  }
}
