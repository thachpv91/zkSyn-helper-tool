require('dotenv').config();
const { ethers } = require('ethers');
const { Web3 } = require('web3');
const web3 = new Web3(process.env.INFURA_URL);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SENDER_ADDRESS = process.env.SENDER_ADDRESS;
const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const GAS_PRICE = process.env.GASPRICE;

const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const abi = [
    // ABI của token ERC20
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transferFrom",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "name": "from", "type": "address"},
            {"indexed": true, "name": "to", "type": "address"},
            {"indexed": false, "name": "value", "type": "uint256"}
        ],
        "name": "Transfer",
        "type": "event"
    }
];

const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

contract.events.Transfer({
    filter: {to: account.address},
    fromBlock: 'latest'
}, async (error, event) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log('New transfer received:', event);

    const value = event.returnValues.value;
    const from = event.returnValues.from;

    console.log(`Transferring ${value} tokens from ${from} to ${RECEIVER_ADDRESS} using transferFrom`);

    const tx = contract.methods.transferFrom(SENDER_ADDRESS, RECEIVER_ADDRESS, value);
    const gas = await tx.estimateGas({from: account.address});
    const gasPrice = ethers.utils.parseUnits(GAS_PRICE, 'gwei') ;

    const data = tx.encodeABI();
    const txData = {
        from: account.address,
        to: CONTRACT_ADDRESS,
        data: data,
        gas,
        gasPrice
    };

    web3.eth.sendTransaction(txData)
        .on('transactionHash', function(hash){
            console.log('Transaction hash:', hash);
        })
        .on('receipt', function(receipt){
            console.log('Transaction receipt:', receipt);
        })
        .on('error', console.error);
});
