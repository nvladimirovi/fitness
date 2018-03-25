const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const DayNote = mongoose.model('DayNote')
const errorHandler = require('../utilities/error-handler')

module.exports = {
    create_get: (req, res) => {
        res.render('product/create');
    },
    create_post: (req, res) => {
        let { 
            product, 
            callories, 
            carbs, 
            protein, 
            fat 
        } = req.body

        if(!product || !callories || !carbs || !protein || !fat) {
            res.locals.globalError = 'The information is not valid!'
            res.render('product/create', req.body)
            return;
        }

        Product
        .create({
            product: product, 
            callories: callories,  
            carbs: carbs, 
            protein: protein, 
            fat: fat
        })
        .then(() => {
            res.locals.success = 'The product was successfully created.'
            res.render('product/create')
        })
        .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.render('product/create', req.body)
        })
    },
    read_get: (req, res) => {
        const pageSize = 3
        let page = parseInt(req.query.page) || 1
        let search = req.query.search

        let query = Product.find({})

        if(search) query = query.where("product").regex(new RegExp(search, 'i'))

        query
        .sort("product")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then((products) => {
            res.render('product/all', { 
                products,
                hasPrevPage: page > 1,
                hasNextPage: (page + 1) < products.length,
                prevPage: page - 1,
                nextPage: page + 1,
                search: search
            })
        })
    },
    update_get: (req, res) => {
        Product
            .findById(req.params.id)
            .then((product) => {
                res.render('product/update', { 
                    product
                })
            })
    },
    update_post: (req, res) => {
        Product
        .findById(req.params.id)
        .then((current_product) => {
            const { product, callories, carbs, protein, fat } = req.body

            // VALIDATION...

            if(current_product.product !== product) current_product.product = product
            
            if(current_product.callories !== callories) current_product.callories = callories
            
            if(current_product.carbs !== carbs) current_product.carbs = carbs

            if(current_product.protein !== protein) current_product.protein = protein
            
            if(current_product.fat !== fat) current_product.fat = fat

            current_product
            .save()
            .then((current_product) => {
                res.redirect('/product/update/' + current_product._id)
            })
            .catch((err) => {
                let message = errorHandler.handleMongooseError(err)
                res.locals.globalError = message
                res.render('product/create', req.body)
            })
        })
    },
    delete: (req, res) => {
        Product
        .findOne({_id: req.params.id})
        .then((product) => {
            product
            .remove({_id: product._id})
            .then(() => {
                res.redirect('/product/all')
            })
        })
        .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.redirect('/product/all')
        })
    }
}