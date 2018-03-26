const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let dayNoteSchema = new mongoose.Schema({
  dateOriginal: { type: Date, required: true },
  date: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  user: { type: ObjectId, ref: 'User' },
  products: [{
    product: { type: ObjectId, ref: 'Product', required: true },
    weight: { type: Number, required: true }
  }],
  total: { type: Object }
})

dayNoteSchema.method({
  calcTotal: function () {
    if (this.products.length === 0) {
      console.log('There is no products in products array.')
    }

    this.total = {
      weight: 0,
      callories: 0,
      carbs: 0,
      protein: 0,
      fat: 0
    }

    this.products.forEach(element => {
      this.total.weight += element.weight
      this.total.callories += (element.product.callories / 100) * element.weight
      this.total.carbs += (element.product.carbs / 100) * element.weight
      this.total.protein += (element.product.protein / 100) * element.weight
      this.total.fat += (element.product.fat / 100) * element.weight
    })
  }
})

let DayNote = mongoose.model('DayNote', dayNoteSchema)

module.exports = DayNote
