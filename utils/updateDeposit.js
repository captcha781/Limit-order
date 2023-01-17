const Transaction = require("../models/Transaction")
const user = require("../models/user")
const wallet = require("../models/wallet")

const updateDeposit = async (from, to, value, txHash, symbol) => {
    let addressToFind = await user.findOne({ address: to })
    let addressFromFind = await user.findOne({ address: from })

    if (addressToFind) {
        let txObj = {
            from: from,
            to: to,
            amount: value,
            txHash: txHash,
            type: 'deposit'
        }
        await Transaction.create(txObj)
        let wall = await wallet.findOne({ walletAddress: addressToFind.address })
        let assets = wall.assets
        // let index = await assets.findIndex(item => item.symbol === symbol)
        assets[1].balance = assets[1].balance + value

        await wallet.updateOne({ walletAddress: addressToFind.address }, { $set: { assets: assets } })
        console.log("deposit success");
    }

}

module.exports = updateDeposit