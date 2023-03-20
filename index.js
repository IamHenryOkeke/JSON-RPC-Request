const { Alchemy, Network, Wallet, Utils } = require('alchemy-sdk');

require('dotenv').config();

// create env file which saves api key and private key
const { TEST_API_KEY, TEST_PRIVATE_KEY } = process.env;

const settings = {
  apiKey: TEST_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

let wallet = new Wallet(TEST_PRIVATE_KEY);

async function main() {
  const nonce = await alchemy.core.getTransactionCount(
    wallet.address,
    'latest'
  );

  // define transaction object with the needed params required to define a transaction 
  let transaction = {
    to: "0x06934c3767633432c66278071fDb2Ef46Ae6Fa77",
    value: Utils.parseEther('0.005'), // 0.001 worth of ETH being sent
    gasLimit: '21000',
    maxPriorityFeePerGas: Utils.parseUnits('5', 'gwei'),
    maxFeePerGas: Utils.parseUnits('20', 'gwei'),
    nonce: nonce,
    type: 2,
    chainId: 5, // göerli transaction
  };

  let rawTransaction = await wallet.signTransaction(transaction);
  console.log('Raw tx: ', rawTransaction);
  let tx = await alchemy.core.sendTransaction(rawTransaction);
  // tx returns a transaction json response
  console.log(tx)
  console.log(`https://goerli.etherscan.io/tx/${tx.hash}`);
  // transaction hash is printed to console
}

// call function
main();