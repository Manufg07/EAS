import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

export const EASContractAddress = '0xbB1ed1F64e0041f9C8Ec595BdfAb797A489cFE35'; // Sepolia v0.26

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/aa5dac7082944ce89be0e5b4e458b14c`
);
const signer = new ethers.Wallet(
  "759b047157c23a0e93b3f13fbfdd09de6834a185fe0132714041c146dc3974f1",
  provider
);


// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
eas.connect(provider);


const schemaRegistryContractAddress = '0x23C85e21C286a93a9Ace16EE4C6b66D10e557213';
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

schemaRegistry.connect(signer);


const schema = "bytes32 nameHash, bytes32 dobHash, bytes32 nationalityHash, bytes32 employmentStatusHash, bool isAttested";
const resolverAddress = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0'; // Sepolia 0.26
const revocable = true;

const transaction = await schemaRegistry.register({
  schema,
  resolverAddress,
  revocable
});

// Optional: Wait for transaction to be validated
await transaction.wait();
console.log("New Schema Created", transaction);
console.log(transaction.receipt.hash)
 
console.log("Transaction mined successfully:");
console.log("Block Number:", transaction.receipt.blockNumber);
console.log("Transaction Hash:", transaction.receipt.hash);
console.log("Gas Used:", transaction.receipt.gasUsed.toString());
console.log("Status:", transaction.receipt.status ? "Success" : "Failed");


