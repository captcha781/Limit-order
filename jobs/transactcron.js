const cron = require('node-cron')
const orderModel = require('../models/orderbook')
const assetModel = require("../models/assets")
const transferToSeller = require('../utils/transferToSeller')
const user = require('../models/user')
const { decrypt } = require('../utils/cryptos')
const transferCoins = require('../utils/transferCoins')


module.exports = () => {
    cron.schedule("*/5 * * * * *", async () => {
        let buys = await orderModel.find({ type: "buy", status: "open" })

        await buys.map(async (buy) => {
            const sellFind = await orderModel.findOne({ value: buy.value, requestedPrice: { $lte: buy.requestedPrice }, status: 'open', tradedFor: 'BNB', type: 'sell', userId: { $ne: buy.userId } })
            if (!sellFind) {
                return ""
            }
            if (sellFind) {
                sellFind.status = 'close'
                sellFind.soldTo = buy.userId
                sellFind.soldPrice = sellFind.requestedPrice
                buy.status = 'close'
                buy.soldTo = sellFind.userId
                buy.soldPrice = sellFind.requestedPrice
                const findSeller = await user.findById(sellFind.userId)
                const findBuyer = await user.findById(buy.userId)
                let sellermove = await transferToSeller(findSeller.address, sellFind.requestedPrice * sellFind.value)
                let buyerCoinMove = await transferCoins(process.env.SERVER_ADDRESS, findBuyer.address, sellFind.value, process.env.SERVER_PRIVKEY, 'server-withdraw')
                await assetModel.updateOne({ symbol: "BNB" }, { $set: { assetPrice: sellFind.requestedPrice } })
                await sellFind.save()
                await buy.save()
            }
        })

        // console.log("Transact cron");
    })
}


