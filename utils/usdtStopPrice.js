const assetModel = require("../models//assets")

const USDTstopPrice = async (body) => {
    let rcvdType = body.exchangeType.replace(body.for, "")
    let recvAssetPrice = await assetModel.findOne({ symbol: rcvdType })
    return body.stop * recvAssetPrice.assetPrice
}

module.exports = USDTstopPrice