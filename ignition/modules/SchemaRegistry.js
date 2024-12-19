// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SchemaRegistryModule", (m) => {

  const sr = m.contract("SchemaRegistry");

  return { sr };
});