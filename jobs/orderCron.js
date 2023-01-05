const cron = require('node-cron')
const exchangeModel = require('../models/exchange')
const orderModel = require('../models/orderbook')
const assetModel = require('../models/assets')

module.exports = () => {
    cron.schedule("*/5 * * * * *", async () => {
        console.log("Updater cron");
        let asset = await assetModel.findOne({ symbol: "BNB" })
        let spotPrice = asset.assetPrice
        let updater = await orderModel.updateMany({ orderType: "limit", type: "buy", status: 'unplaced', requestedPrice: { $lte: spotPrice } }, { $set: { status: 'open' } })
        let sellupdate = await orderModel.updateMany({ orderType: "limit", type: "sell", status: 'unplaced', requestedPrice: { $gte: spotPrice } }, { $set: { status: 'open' } })
        // console.log(updater, sellupdate);
    })
}
