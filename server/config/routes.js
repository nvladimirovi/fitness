const controllers = require("../controllers")
const auth = require("./auth")

module.exports = app => {
	app.get("/", controllers.home.index);
	app.get("/about", auth.isAuthenticated, controllers.home.about)

	/**
	 * User
	 */
	app.get(
		"/users/register",
		auth.isAlreadyAuthenticated,
		controllers.users.registerGet
	);
	app.post("/users/register", controllers.users.registerPost)
	app.get(
		"/users/login",
		auth.isAlreadyAuthenticated,
		controllers.users.loginGet
	);
	app.post("/users/login", controllers.users.loginPost)
	app.post("/users/logout", controllers.users.logout)
	app.get("/users/me", auth.isAuthenticated, controllers.users.profile)

	/**
	 * Cars
	 */
	app.get("/cars/add", auth.isInRole("Admin"), controllers.cars.addGet)
	app.post("/cars/add", auth.isInRole("Admin"), controllers.cars.addPost)
	app.get("/cars/all", controllers.cars.all);
	app.post("/cars/rent/:id", auth.isAuthenticated, controllers.cars.rent)

	/**
	 * Product CRUD
	 */
	app 
		.route("/product/create")
		.get(auth.isInRole("Admin"), controllers.product.create_get)
		.post(auth.isInRole("Admin"),controllers.product.create_post)
	
	app
		.get("/product/all", auth.isInRole("Admin"), controllers.product.read_get)
		.post("/product/delete/:id", auth.isInRole("Admin"), controllers.product.delete)

	app
		.route("/product/update/:id")
		.get(auth.isInRole("Admin"), controllers.product.update_get)
		.post(auth.isInRole("Admin"),controllers.product.update_post)
	/**
	 * Daynote CRUD
	 */
	app
		.route("/daynote/create")
		.get(auth.isAuthenticated, controllers.daynote.create_get)
		.post(auth.isAuthenticated, controllers.daynote.create_post)

	/**
	 * Not Found
	 */
	app.all("*", (req, res) => {
		res.status(404)
		res.send("404 Not Found!")
		res.end()
	});
};
