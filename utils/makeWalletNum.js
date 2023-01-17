const wallet = require('../models/wallet')
const isEmpty = require('./isEmpty')

const makeWalletNum = async () => {
    let nums = Math.random().toString(10).slice(2)
    let wall = await wallet.findOne({ walletId: nums })
    if(!wall){
        makeWalletNum()
    } else {
        return nums
    }
}

module.exports = makeWalletNum