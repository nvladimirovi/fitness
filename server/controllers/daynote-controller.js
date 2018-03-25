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
		const daynote_req = req.body
		const current_user_id = req.user._id

		const weight = parseInt(daynote_req.weight);

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

		const newDate = new Date()
		const date = newDate.getDate()
		const month = newDate.getMonth()
		const year = newDate.getFullYear()

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

						const newNote = {
							dateOriginal: newDate,
							date,
							month,
							year,
							user: user._id,
							products: [{
								product: product._id,
								weight: daynote_req.weight
							}],
							total: {
								weight,
								callories: (product.callories / 100) * weight,
								carbs: (product.carbs / 100) * weight,
								protein: (product.protein / 100) * weight,
								fat: (product.fat / 100) * weight,
							}
						}

						if (daynote_req.yourWeight && daynote_req.yourWeight > 0) {
							newNote.yourWeight = parseInt(daynote_req.yourWeight) || 0
						}

						DayNote
						.create(newNote)
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
		const postToDel = req.params.id;

		DayNote
		.findById(postToDel)
		.then((note) => {
			note.remove({ _id: note._id})
			res.redirect('/users/profile');
		})
		.catch((err) => {
			let message = errorHandler.handleMongooseError(err);
			res.locals.globalError = message;
			res.render("users/profile");
		})
	}
};
