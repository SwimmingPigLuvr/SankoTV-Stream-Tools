/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-ethers');
const { privateKey } = require('./secrets.json');

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sanko",
  networks: {
    sanko: {
      url: "https://sanko-arb-sepolia.rpc.caldera.xyz/http", // sanko testnet RPC
      chainId: 1992,
      accounts: [privateKey]
    }
  },
  paths: {
    sources: "./src/lib/contracts/",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  }
};
