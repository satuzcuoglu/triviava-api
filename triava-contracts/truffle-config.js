const HDWalletProvider = require("@truffle/hdwallet-provider");

const providerKey = process.env.INFURA_KEY_KOVAN;
// const mnemonic = process.env.MNEMONIC;
const mnemonic =
  "MNEMONIC";
const gasPrice = 50000000000;
const gasAmount = 3000000;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8545, // <-- If you change this, also set the port option in .solcover.js.
      gas: gasAmount, // <-- Use this high gas value
      gasPrice: gasPrice, // <-- Use this low gas price
    },
    kovan: {
      gasPrice: gasPrice,
      gas: gasAmount,
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          "https://kovan.infura.io/v3/" + providerKey
        );
      },
      network_id: 42,
      skipDryRun: true,
    },
    rinkeby: {
      gasPrice: gasPrice,
      gas: gasAmount,
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/" + providerKey
        );
      },
      network_id: 4,
    },
    ropsten: {
      gasPrice: gasPrice,
      gas: gasAmount,
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/v3/" + providerKey
        );
      },
      network_id: 3,
    },
    fuji: {
      gasPrice: gasPrice,
      gas: gasAmount,
      provider: () => {
        return new HDWalletProvider({
          mnemonic,
          providerOrUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
          chainId: "1",
          addressIndex: 0,
          derivationPath: "m/44'/60'/0'/0/"
        });
      },
      network_id: "1",
      skipDryRun: false,
    },
    mainnet: {
      gasPrice: gasPrice,
      gas: gasAmount,
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          "https://mainnet.infura.io/v3/" + providerKey
        );
      },
      network_id: 1,
      skipDryRun: true,
    },
  },
  mocha: {
    // timeout: 100000
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.3", // Fetch exact version from solc-bin (default: truffle's version)
      docker: false, // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "byzantium",
      },
    },
  },
};
