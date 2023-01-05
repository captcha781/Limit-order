// exports.makeRequest = expressAsyncHandler(async (req, res) => {
//     try {

//         const body = req.body
//         let spotPrice = await getSpotPrice(body.for)
//         let base = await exchangeModel.findOne({})

//         let findMatch = await orderModel.findOne({
//             type: body.type === "sell" ? "buy" : "sell",
//             orderType: body.orderType,
//             value: body.value,
//             requestedPrice: body.limitPrice,
//             status: "open",
//             userId: { $ne: req.user._id }
//         })

//         if (!findMatch) {
//             if (body.type === "buy") {
//                 let pup = body.limitPrice;
//                 if (!body.exchangeType.endsWith(base.baseCurrency)) {
//                     let bytype = body.exchangeType.replace(body.for, "")
//                     let getByTypePrice = await assetModel.findOne({ symbol: bytype })
//                     if (!getByTypePrice) {
//                         return res.status(400).json({ success: false, message: "The requested Exchange method is not available" })
//                     }
//                     pup = getByTypePrice.assetPrice * body.limitPrice
//                 }

//                 const statusFinder = findStatus(body, spotPrice)
//                 let updatedMatchFinder = await orderModel.findOne({
//                     type: "sell",
//                     orderType: body.orderType,
//                     value: body.value,
//                     $and: [{ requestedPrice: { $gte: spotPrice } }, { requestedPrice: { $lte: pup } }],
//                     status: "open",
//                     userId: { $ne: req.user._id }
//                 }).sort({ requestedPrice: 1 })
//                 console.log(updatedMatchFinder);

//                 let createOrder = await orderModel.create({
//                     exhangeType: body.exchangeType,
//                     tradedFor: body.for,
//                     type: body.type,
//                     orderType: body.orderType,
//                     value: body.value,
//                     requestedPrice: updatedMatchFinder ? updatedMatchFinder.requestedPrice : pup,
//                     status: updatedMatchFinder ? "close" : statusFinder,
//                     limitPrice: body.orderType !== "market" ? body.limit : 0,
//                     stopPrice: body.orderType === "stop-limit" ? body.stop : 0,
//                     userId: req.user._id
//                 })
//                 if (updatedMatchFinder) {
//                     updatedMatchFinder.status = "close"
//                     await updatedMatchFinder.save()
//                     await assetModel.findOneAndUpdate({ symbol: body.for, assetPrice: createOrder.requestedPrice })
//                 }

//                 return res.json({ success: true, message: `Your order of ${body.type} for ${body.value} ${body.for} is successfully placed!`, result: createOrder })
//             } else {
//                 let pup = body.limitPrice;
//                 if (!body.exchangeType.endsWith(base.baseCurrency)) {
//                     let bytype = body.exchangeType.replace(body.for, "")
//                     let getByTypePrice = await assetModel.findOne({ symbol: bytype })
//                     if (!getByTypePrice) {
//                         return res.status(400).json({ success: false, message: "The requested Exchange method is not available" })
//                     }
//                     pup = getByTypePrice.assetPrice * body.limitPrice
//                 }
//                 const statusFinder = findStatus(body, spotPrice)

//                 let updatedMatchFinder = await orderModel.findOne({
//                     type: "buy",
//                     orderType: body.orderType,
//                     value: body.value,
//                     $and: [{ requestedPrice: { $gte: spotPrice } }, { requestedPrice: { $lte: pup } }],
//                     status: "open",
//                     userId: { $ne: req.user._id }
//                 }).sort({ requestedPrice: -1 })


//                 let createOrder = await orderModel.create({
//                     exhangeType: body.exchangeType,
//                     tradedFor: body.for,
//                     type: body.type,
//                     orderType: body.orderType,
//                     value: body.value,
//                     requestedPrice: updatedMatchFinder ? updatedMatchFinder.requestedPrice : pup,
//                     status: updatedMatchFinder ? 'close' : statusFinder,
//                     limitPrice: body.orderType !== "market" ? body.limit : 0,
//                     stopPrice: body.orderType === "stop-limit" ? body.stop : 0,
//                     userId: req.user._id
//                 })
//                 if (updatedMatchFinder) {
//                     updatedMatchFinder.status = "close"
//                     await updatedMatchFinder.save()
//                     await assetModel.findOneAndUpdate({ symbol: body.for, assetPrice: createOrder.requestedPrice })
//                 }

//                 return res.json({ success: true, message: `Your order of ${body.type} for ${body.value} ${body.for} is successfully placed!`, result: createOrder })
//             }
//         } else {

//         }

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ success: false, message: 'Something went wrong' })
//     }
// })