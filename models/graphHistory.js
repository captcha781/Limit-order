const mongoose = require('mongoose')

const graphHistorySchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("graphHistory", graphHistorySchema, "graphHistory")