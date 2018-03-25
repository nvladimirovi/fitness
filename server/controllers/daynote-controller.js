const mongoose = require("mongoose")
const DayNote = mongoose.model("DayNote")
const User = mongoose.model("User")
const Product = mongoose.model("Product")
const errorHandler = require("../utilities/error-handler")

module.exports = {
  	create_get: (req, res) => {
		Product
		.find({})
		.sort("product")
		.then((products) => {
			res.render("daynote/create", { products })
		})
  	},
	create_post: (req, res) => {
		let daynote_req = req.body
		let current_user_id = req.user._id

		let weight = parseInt(daynote_req.weight);

		if (!daynote_req.product || !daynote_req.weight) {
			res.locals.globalError = "All fields are required!"
			Product
			.find({})
			.sort("product")
			.then((products) => {
				res.render("daynote/create", { products })
			})
			return;
		}

		let newDate = new Date()
		let date = newDate.getDate()
		let month = newDate.getMonth()
		let year = newDate.getFullYear()

		User
		.findById(current_user_id)
		.then((user) => {
			DayNote
			.findOne({ user: current_user_id, date, month, year })
			.then((note) => {
				if(note) {
					console.log("Note already exist!")
					Product
					.findOne({ product: daynote_req.product })
					.then((product) => {
						let { callories, carbs, protein, fat } = note.total

						note
						.products.push({
							product: product._id, weight
						})

						note.total = {
							weight: note.total.weight + weight,
							callories: parseInt(callories + ((product.callories / 100) * weight)),
							carbs: carbs + ((product.carbs / 100) * weight),
							protein: protein + ((product.protein / 100) * weight),
							fat: fat + ((product.fat / 100) * weight)
						}
						
						note
						.save()
						.then(() => {
							res.redirect("/daynote/create")
						})
					})
				} else {
					Product
					.findOne({ product: daynote_req.product })
					.then((product) => {
						DayNote
						.create({
							dateOriginal: newDate,
							date,
							month,
							year,
							user: user._id,
							products: [{ 
								product: product._id, weight: daynote_req.weight 
							}],
							total: {
								weight,
								callories: (product.callories / 100) * weight,
								carbs: (product.carbs / 100) * weight,
								protein: (product.protein / 100) * weight,
								fat: (product.fat / 100) * weight,
							}
						})
						.then(() => {
							res.redirect("/daynote/create")
						})
					})
					.catch((err) => {
						let message = errorHandler.handleMongooseError(err);
						res.locals.globalError = message;
						res.render("daynote/create");
					})
				}
			})
		})
	},
	update_get: (req, res) => {

	},
	update_post: (req, res) => {

	},
	delete_product_post: (req, res) => {

	},
	delete_post: (req, res) => {
		
	}
};
