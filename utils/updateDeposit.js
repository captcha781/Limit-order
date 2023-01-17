const Transaction = require("../models/Transaction")
const user = require("../models/user")
const wallet = require("../models/wallet")
const web3 = require('../config/Web3Instance')

async function getConfirmations(txHash) {
    try {
        const trx = await web3.eth.getTransaction(txHash)
        console.log(trx);
        // Get current block number
        const currentBlock = await web3.eth.getBlockNumber()
        console.log(currentBlock);
        // When transaction is unconfirmed, its block number is null.
        // In this case we return 0 as number of confirmations
        return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
    }
    catch (error) {
        console.log(error, "---------------=====-------------")
    }
}

const updateDeposit = async (from, to, value, txHash, symbol, confirmations = 10) => {
    let addressToFind = await user.findOne({ address: to })
    let addressFromFind = await user.findOne({ address: from })

    if (addressToFind) {
        setTimeout(async () => {
            const trxConfirmations = await getConfirmations(txHash)
            if (trxConfirmations < confirmations) {
                console.log("recursive");
                return updateDeposit(from, to, value, txHash, symbol)
            }
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
            assets[1].balance = Number(assets[1].balance) + Number(value)

            await wallet.updateOne({ walletAddress: addressToFind.address }, { $set: { assets: assets } })
            console.log("deposit success");

        }, 30 * 1000);


    }

}

module.exports = updateDeposit