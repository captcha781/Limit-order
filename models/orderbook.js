const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    exhangeType: {
        type: String,
        required: true
    },
    tradedFor: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['buy', 'sell']
    },
    orderType: {
        type: String,
        default: 'limit',
        enum: ['limit', 'stop-limit', 'market']
    },
    value: {
        type: Number,
        required: true
    },
    requestedPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'open',
        enum: ['open', 'close']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('orderbook', orderSchema, 'orderbook')