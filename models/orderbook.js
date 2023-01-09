const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    exchangeType: {
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
        enum: ['open', 'close', 'unplaced']
    },
    limitPrice: {
        type: Number,
        default: 0
    },
    stopPrice: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    soldTo: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    soldPrice: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('orderbook', orderSchema, 'orderbook')