require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/aa5dac7082944ce89be0e5b4e458b14c`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
};

