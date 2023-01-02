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
    assetPrice: {
        type: Number,
        required: true
    },
    assetPriceCurrency: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "exchanges"
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('assets', assetSchema, 'assets')