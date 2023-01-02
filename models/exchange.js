const mongoose = require('mongoose')

const exchangeSchema = new mongoose.Schema({
    baseCurrency: {
        type: String,
        required: true
    },
    baseCurrencyValInUSD: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("exchanges", exchangeSchema, "exchanges")