const mongoose = require('mongoose')

const WalletAssetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    network: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
})

const WalletSchema = new mongoose.Schema({
    walletId: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    assets: {
        type: [WalletAssetSchema],
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('wallets', WalletSchema, 'wallets')
