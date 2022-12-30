const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema({
    assetName: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    assetprice: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('assets', assetSchema, 'assets')