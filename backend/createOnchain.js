import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const EASContractAddress = "0xbB1ed1F64e0041f9C8Ec595BdfAb797A489cFE35";
const eas = new EAS(EASContractAddress);

const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/aa5dac7082944ce89be0e5b4e458b14c`
);
const signer = new ethers.Wallet(
  "759b047157c23a0e93b3f13fbfdd09de6834a185fe0132714041c146dc3974f1",
  provider
);

eas.connect(signer);

const schemaEncoder = new SchemaEncoder(
  "bytes32 nameHash, bytes32 dobHash, bytes32 nationalityHash, bytes32 employmentStatusHash, bool isAttested"
);

function isValidBytes32(value) {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

try {
  const dataToEncode = [
    { name: "nameHash", value: "0x9285d7c3a514a4a9e8c5b9af875cde7cf2c25c6da2d73a7b43b6dd4ad0d7ad09", type: "bytes32" },
    { name: "dobHash", value: "0x9285d7c3a514a4a9e8c5b9af875cde7cf2c25c6da2d73a7b43b6dd4ad0d7ad09", type: "bytes32" },
    { name: "nationalityHash", value: "0x9285d7c3a514a4a9e8c5b9af875cde7cf2c25c6da2d73a7b43b6dd4ad0d7ad09", type: "bytes32" },
    { name: "employmentStatusHash", value: "0x9285d7c3a514a4a9e8c5b9af875cde7cf2c25c6da2d73a7b43b6dd4ad0d7ad09", type: "bytes32" },
    { name: "isAttested", value: true, type: "bool" },
  ];

  if (!dataToEncode.every((item) => item.type !== "bytes32" || isValidBytes32(item.value))) {
    throw new Error("Invalid bytes32 values in data.");
  }

  const encodedData = schemaEncoder.encodeData(dataToEncode);

  const schemaUID = "0xa60727177e1d3fb47da80b2034c9cc2b3181d249593e5ae59a4282b5f964c87f";

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
      expirationTime: 0, // Set dynamic expiration if needed
      revocable: true,
      data: encodedData,
    },
  });

  console.log("Transaction sent. Hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("New attestation UID:", receipt.uid);
} catch (error) {
  console.error("Error:", error.message);
}
