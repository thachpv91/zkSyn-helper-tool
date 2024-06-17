// Import ethers and zkSync libraries
const { ethers } = require('ethers');
const { Wallet, Provider } = require('@matterlabs/zksync-web3');

// Function to send tokens on zkSync network
async function sendTokens() {
    // Define the zkSync network provider
    const zkSyncProvider = new Provider(process.env.ZKSYNC_RPC_URL || 'https://mainnet.era.zksync.io'); // Update with mainnet URL if necessary

    // Define the wallet private key
    const privateKey = process.env.ZKSYNC_YOUR_SENDER_ADDRESS;

    // Create a wallet instance
    const zkSyncWallet = new Wallet(privateKey, zkSyncProvider);

    // The ERC20 token contract address
    const tokenAddress = process.env.ZKSYNC_ERC20_TOKEN_ADDRESS;

    // The recipient address (the address to send tokens to)
    const recipientAddress = process.env.ZKSYNC_YOUR_RECEIVER_ADDRESS;

    // The amount of tokens to send (in wei)
    const amount = ethers.utils.parseUnits(process.env.ZKSYNC_SEND_AMOUNT, 18); // 100 tokens with 18 decimals

    // The ERC20 token ABI (Application Binary Interface)
    const tokenABI = [
        "function transfer(address to, uint256 amount) public returns (bool)"
    ];

    // Create a contract instance
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, zkSyncWallet);

    // Send the transfer transaction
    try {
        const tx = await tokenContract.transfer(recipientAddress, amount);
        console.log("Transaction hash:", tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction was mined in block:", receipt.blockNumber);
    } catch (error) {
        console.error("Error sending tokens:", error);
    }
}

// Call the function to send tokens
sendTokens();
