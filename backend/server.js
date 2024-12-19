import express from 'express';
import bodyParser from 'body-parser';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import cors from 'cors';
import identityAttestationABI from './abis/IdentityAttestation.json'  assert { type: 'json' };

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ethereum provider setup (using Infura or Alchemy)
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);  // Replace with your Infura or Alchemy URL

// Define the contract addresses and ABI (simplified example)
const identityAttestationAddress = process.env.IDENTITY_ATTESTATION_ADDRESS;
const easAddress = process.env.EAS_ADDRESS;

// import easABI from './abis/EAS.json';
// Create contract instances
const identityAttestationContract = new ethers.Contract(identityAttestationAddress, identityAttestationABI, provider);
const easContract = new ethers.Contract(easAddress, easABI, provider);

// Routes

// Route for wallet connection
app.post('/connect', async (req, res) => {
    const { walletAddress } = req.body;
    try {
        // Check if the address is a valid Ethereum address
        if (!ethers.utils.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }
        // Respond with a success message
        res.status(200).json({ message: `Connected to wallet: ${walletAddress}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect wallet' });
    }
});

// Route to attest identity (using IdentityAttestation contract)
app.post('/attest', async (req, res) => {
    const { walletAddress, nameHash, dobHash, nationalityHash, employmentStatusHash } = req.body;

    try {
        if (!ethers.utils.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        // Create the signer using the provided wallet address
        const signer = provider.getSigner(walletAddress);

        // Connect to the contract with the signer
        const contractWithSigner = identityAttestationContract.connect(signer);

        // Call the attestIdentity function on the contract
        const transaction = await contractWithSigner.attestIdentity(nameHash, dobHash, nationalityHash, employmentStatusHash);

        // Wait for the transaction to be mined
        await transaction.wait();

        // Respond with success message
        res.status(200).json({ message: 'Identity attested successfully', transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to attest identity' });
    }
});

// Route to verify identity (using IdentityAttestation contract)
app.post('/verify', async (req, res) => {
    const { workerAddress, nameHash, dobHash, nationalityHash, employmentStatusHash } = req.body;

    try {
        const isVerified = await identityAttestationContract.verifyIdentity(workerAddress, nameHash, dobHash, nationalityHash, employmentStatusHash);

        if (isVerified) {
            res.status(200).json({ message: 'Identity verified successfully' });
        } else {
            res.status(400).json({ error: 'Identity verification failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify identity' });
    }
});

// Route to register schema (using EAS contract)
app.post('/register-schema', async (req, res) => {
    const { schema, resolverAddress, revocable } = req.body;

    try {
        // Create the signer using the provided wallet address (e.g., an admin or EAS manager)
        const signer = provider.getSigner();
        const contractWithSigner = easContract.connect(signer);

        // Register the schema via EAS
        const transaction = await contractWithSigner.register({
            schema,
            resolverAddress,
            revocable
        });

        await transaction.wait();

        res.status(200).json({ message: 'Schema registered successfully', transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register schema with EAS' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
