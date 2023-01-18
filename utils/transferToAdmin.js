const web3C = require('../config/Web3ContractInstance')
const Web3 = require('web3')
const user = require("../models/user")
const { decrypt } = require("../utils/cryptos")
const EthAccounts = require('web3-eth-accounts');
const Transaction = require('../models/Transaction');
const wallet = require('../models/wallet');
const administrator = require('../models/adminstrator')

const web3 = new Web3('https://data-seed-prebsc-1-s3.binance.org:8545/');
const accounts = new EthAccounts('https://data-seed-prebsc-1-s3.binance.org:8545/');

const transferToAdmin = async (tokens, fromAddr) => {
    try {
        let success;
        const data = web3C.methods.transfer(process.env.SERVER_ADDRESS, web3.utils.toWei(String(tokens), 'ether')).encodeABI()
        const txCount = await web3.eth.getTransactionCount(fromAddr)
        const userFind = await user.findOne({ address: fromAddr })
        let privateKey = decrypt(userFind.privateKey).replace("0x", "")

        const suggestion_gas = await web3.eth.getGasPrice();
        const estimate_gas = await web3.eth.estimateGas({
            'from': fromAddr,
            'nonce': txCount,
            'to': process.env.USDT_CONTRACT_ADDRESS,
            'data': data,
        });

        const txObject = {
            to: process.env.USDT_CONTRACT_ADDRESS,
            data,
            gasPrice: web3.utils.toHex(suggestion_gas),
            gasLimit: web3.utils.toHex(estimate_gas),
            chainId: 97,
        };

        let wall = await wallet.findOne({ walletAddress: fromAddr })
        let assets = wall.assets
        if (assets[1].balance < tokens) {
            return { status: false, message: "Insufficient tokens in your account" }
        }

        const signedTransaction = await accounts.signTransaction(txObject, privateKey);

        let trx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
            .on('receipt', async (receipt) => {
                console.log("-----------------------------TRANSACTION TO ADMIN RECEIPT-----------------------------")
                console.log('Transaction receipt:', receipt);
                console.log("-----------------------------xxxxxxxxxxxxxxxxxxxxxxxxxxxx-----------------------------")
                success = true

                let transactHistory = {
                    from: fromAddr,
                    to: process.env.SERVER_ADDRESS,
                    amount: tokens,
                    isToken: true,
                    tokenName: 'USDT',
                    txHash: receipt.transactionHash,
                    type: 'server-deposit'
                }
                await Transaction.create(transactHistory)

                let wall = await wallet.findOne({ walletAddress: fromAddr })
                let assets = wall.assets
                assets[1].balance = Number(assets[1].balance) - Number(tokens)
                await wallet.updateOne({ walletAddress: fromAddr }, { $set: { assets: assets } })

                let serverData = await administrator.findOne({})
                // console.log(serverData);
                serverData.USDT = serverData.USDT + Number(tokens)
                await serverData.save()

                return "Successful transaction"

            })
            .on('error', (error) => {
                console.log("Transaction errro", error)
                success = false
                return "Failed Transaction"
            })
        return { status: success, message: success ? "Transaction Success" : "Transaction failed" }
    } catch (error) {
        console.log(error);
        return { status: false, message: "Something went wrong" }
    }
}

module.exports = transferToAdmin