// Import ethers and zkSync libraries
const { ethers } = require('ethers');
const { Wallet, Provider } = require('@matterlabs/zksync-web3');

// Function to monitor ERC20 transfers and send tokens on zkSync network
async function monitorAndSendTokens() {
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

    // The ERC20 token ABI (Application Binary Interface)
    const tokenABI = [
        "event Transfer(address indexed from, address indexed to, uint256 value)",
        "function transfer(address to, uint256 amount) public returns (bool)"
    ];

    // Create a contract instance
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, zkSyncWallet);

    // Listen for Transfer events
    tokenContract.on('Transfer', async (from, to, value, event) => {
        console.log(`Transfer detected: ${value.toString()} tokens from ${from} to ${to}`);

        // Check if the recipient address is the wallet address
        if (to.toLowerCase() === zkSyncWallet.address.toLowerCase()) {
            console.log(`Tokens received: ${value.toString()} - Preparing to send the same amount`);

            // Send tokens to the specified recipient address
            try {
                const tx = await tokenContract.transfer(recipientAddress, value);
                console.log("Transaction hash:", tx.hash);

                // Wait for the transaction to be mined
                const receipt = await tx.wait();
                console.log("Transaction was mined in block:", receipt.blockNumber);
            } catch (error) {
                console.error("Error sending tokens:", error);
            }
        }
    });

    console.log(`Monitoring token transfers to address: ${zkSyncWallet.address}`);
}

// Call the function to monitor and send tokens
monitorAndSendTokens();
