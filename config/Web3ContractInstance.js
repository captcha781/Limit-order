const web3 = require("./Web3Instance")
const USDT_ABI = require('./ABI.json')

module.exports = new web3.eth.Contract(USDT_ABI, process.env.USDT_CONTRACT_ADDRESS)