const cron = require('node-cron')
const orderModel = require('../models/orderbook')
const assetModel = require("../models/assets")

module.exports = () => {
    cron.schedule("*/5 * * * * *", async () => {
        let buys = await orderModel.find({ type: "buy", status: "open" })

        await buys.map(async (buy) => {
            const sellFind = await orderModel.findOne({ value: buy.value, requestedPrice: buy.requestedPrice, status: 'open', tradedFor: 'BNB', type: 'sell' })
            if (!sellFind) {
                return ""
            }
            if (sellFind) {
                sellFind.status = 'close'
                sellFind.soldTo = buy.userId
                buy.status = 'close'
                buy.soldTo = sellFind.userId
                await assetModel.updateOne({ symbol: "BNB" }, { $set: { assetPrice: buy.requestedPrice } })
                await sellFind.save()
                await buy.save()
            }
        })

        console.log("Transact cron");
    })
}


