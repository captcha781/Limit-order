const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    from: {
        type: String,
        default: ""
    },
    to: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        default: 0
    },
    txHash: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdraw']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('transactions', TransactionSchema, 'transactions')