module.exports = {
  roundTo: (n, digits) => {
    let negative = false
    if (digits === undefined) {
      digits = 0
    }
    if (n < 0) {
      negative = true
      n = n * -1
    }
    var multiplicator = Math.pow(10, digits)
    n = parseFloat((n * multiplicator).toFixed(11))
    n = (Math.round(n) / multiplicator).toFixed(2)
    if (negative) {
      n = (n * -1).toFixed(2)
    }
    return parseFloat(n)
  }
}
