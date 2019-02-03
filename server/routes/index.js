const controllers = require('../controllers')
const api = require('./api')

module.exports = (app) => {
	app.use('/api', api)
	app.get('/', controllers.home.index)
}
