const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let dayNoteSchema = new mongoose.Schema({
    dateOriginal: { type: Date, required: true },
    date: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    user: { type: ObjectId, ref: 'User' },
    products: [ 
        { 
            product: { type: ObjectId, ref: 'Product', required: true },
            weight: { type: Number, required: true }  
        } 
    ],
    total: { type: Object }
})

let DayNote = mongoose.model('DayNote', dayNoteSchema)

module.exports = DayNote
