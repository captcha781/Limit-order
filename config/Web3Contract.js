const web3 = require('./Web3Instance')
const contractABI = require('./ABI.json')
const updateDeposit = require('../utils/updateDeposit')

const _contractInstance = async () => {
    let contract = new web3.eth.Contract(contractABI, '0x6Bb0e8532BB4bD431b10D84df2b1469675f3f4Ae')

    contract.events.Transfer()
        .on('connected', (subId) => {
            console.log("Connected to eventlistener :", subId);
        })
        .on('data', (result) => {
            console.log("Transfer detected");
            updateDeposit(result.returnValues.from, result.returnValues.to, web3.utils.fromWei(result.returnValues.value, 'ether', result.transactionHash),result.transactionHash, 'USDT')
        })
}

module.exports = _contractInstance