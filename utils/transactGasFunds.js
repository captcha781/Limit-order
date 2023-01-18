const web3 = require('../config/Web3Instance')
const EthAccounts = require('web3-eth-accounts');
const Transaction = require('../models/Transaction');

const accounts = new EthAccounts(process.env.WEB3_URL);

const transactGasFunds = async (address) => {
    try {
        let result = { status: '', message: '' };
        const txCount = await web3.eth.getTransactionCount(process.env.SERVER_ADDRESS)
        const suggestion_gas = await web3.eth.getGasPrice();
        const estimate_gas = await web3.eth.estimateGas({
            'from': process.env.SERVER_ADDRESS,
            'nonce': txCount,
            'to': address,
            'value': web3.utils.toHex(web3.utils.toWei('0.01', 'ether')),
        });

        const txObject = {
            to: address,
            value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')),
            gasPrice: web3.utils.toHex(suggestion_gas),
            gasLimit: web3.utils.toHex(estimate_gas),
            chainId: 97,
        };
        const signedTransaction = await accounts.signTransaction(txObject, process.env.SERVER_PRIVKEY);

        let trx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
            .on('receipt', async (receipt) => {
                console.log("Minimum wallet Transaction funds added.");
                result = { status: true, message: 'Deposit of minimum funds successful' }
                let transactHistory = {
                    from: process.env.SERVER_ADDRESS,
                    to: address,
                    amount: 0.01,
                    isToken: false,
                    tokenName: 'BNB',
                    txHash: receipt.transactionHash,
                    type: 'gas-fund-shift'
                }
                await Transaction.create(transactHistory)
                return result
            })
            .on('error', (error) => {
                console.log(error);
                result = { status: false, message: 'Deposit of minimum funds failed' }
                return result
            })
        return result
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Something went wrong' }
    }
}

module.exports = transactGasFunds