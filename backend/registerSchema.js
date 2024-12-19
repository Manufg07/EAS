import { ethers } from "ethers";
// Import the ABI from the JSON file
import schemaRegistryABI from "./abis/SchemaRegistry.json" assert { type: "json" };

const schemaRegistryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

// Set up provider and signer
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/aa5dac7082944ce89be0e5b4e458b14c`
);
const signer = new ethers.Wallet(
  "759b047157c23a0e93b3f13fbfdd09de6834a185fe0132714041c146dc3974f1",
  provider
);

// Create contract instance
const schemaRegistry = new ethers.Contract(schemaRegistryAddress, schemaRegistryABI.abi, signer);

// Register a schema function
async function registerSchema(schema, resolverAddress, revocable) {
    try {
        const tx = await schemaRegistry.register(schema, resolverAddress, revocable);
        console.log("Transaction sent, waiting for receipt...");

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);

        // Get the UID returned by the register function
        const uid = receipt.events[0].args[0];  // UID is emitted in the Registered event
        console.log("Schema registered with UID:", uid);

        return uid;
    } catch (error) {
        console.error("Error registering schema:", error);
    }
}

// Retrieve schema function
async function getSchema(uid) {
    try {
        const schemaRecord = await schemaRegistry.getSchema(uid);
        console.log("Schema retrieved:", schemaRecord);
        return schemaRecord;
    } catch (error) {
        console.error("Error retrieving schema:", error);
    }
}

// Example usage:

// Register a new schema
const schema = "bytes32 nameHash, bytes32 dobHash, bytes32 nationalityHash, bytes32 employmentStatusHash, bool isAttested";
const resolverAddress = "0xaEF4103A04090071165F78D45D83A0C0782c2B2a"; // Replace with the actual resolver contract address
const revocable = true;

registerSchema(schema, resolverAddress, revocable, { gasLimit: 5000000 }).then(async (uid) => {
    // Get the schema after registration
    await getSchema(uid);
});


