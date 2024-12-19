import { SchemaRegistry} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();
// Configuration constants
const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

async function registerSchema() {
    try {
        // Initialize provider and signer
        const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/217cc64309904254aa54e39f0f6de84c`);
        const signer = new ethers.Wallet('9dd3d92396a587cf8d613759cc7280c307ef9219c6f5774e56d03d113a69ebc0', provider);
        schemaRegistry.connect(signer);

        // Initialize SchemaEncoder with the schema string  
        const schema = "bytes32 nameHash, bytes32 dobHash, bytes32 nationalityHash, bytes32 employmentStatusHash, bool isAttested";
        const revocable = true; // A flag allowing an attestation to be revoked

        const transaction = await schemaRegistry.register({
            schema,
            revocable,
            // You could add a resolver field here for additional functionality
          });
          
        // Optional: Wait for transaction to be validated
        await transaction.wait();
        console.log("New Schema Created", transaction);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

registerSchema();