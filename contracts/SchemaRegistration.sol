
pragma solidity ^0.8.22;

interface ISchemaRegistry {
    function register(
        string memory schema,
        address resolver,
        bool revocable
    ) external returns (bytes32);
}

contract SchemaRegistration {
    address public schemaRegistryAddress;
    address public owner;

    event SchemaRegistered(bytes32 schemaUID, string schemaDefinition, address resolver, bool revocable);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    constructor(address _schemaRegistryAddress) {
        schemaRegistryAddress = _schemaRegistryAddress;
        owner = msg.sender;
    }

    function registerSchema(
        string memory schema,
        address resolver,
        bool revocable
    ) public onlyOwner returns (bytes32) {
        ISchemaRegistry schemaRegistry = ISchemaRegistry(schemaRegistryAddress);
        bytes32 schemaUID = schemaRegistry.register(schema, resolver, revocable);
        emit SchemaRegistered(schemaUID, schema, resolver, revocable);
        return schemaUID;
    }
}
// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.22;

// interface ISchemaRegistry {
//     function register(
//         string memory schema,
//         address resolver,
//         bool revocable
//     ) external returns (bytes32);
// }
// contract SchemaRegistration {
//     address public schemaRegistryAddress;
//     address public owner;

//     // Storage for schema data (simplified example)
//     mapping(bytes32 => string) public schemaData;

//     event SchemaRegistered(bytes32 schemaUID, string schemaDefinition, address resolver, bool revocable);

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Only the owner can perform this action.");
//         _;
//     }

//     constructor(address _schemaRegistryAddress) {
//         schemaRegistryAddress = _schemaRegistryAddress;
//         owner = msg.sender;
//     }

//     // Resolver function to store data for a schema
//     function storeSchemaData(bytes32 schemaUID, string memory data) public onlyOwner {
//         schemaData[schemaUID] = data;
//     }

//     // Resolver function to retrieve schema data
//     function getSchemaData(bytes32 schemaUID) public view returns (string memory) {
//         return schemaData[schemaUID];
//     }

//     function registerSchema(
//         string memory schema,
//         address resolver,
//         bool revocable
//     ) public onlyOwner returns (bytes32) {
//         ISchemaRegistry schemaRegistry = ISchemaRegistry(schemaRegistryAddress);
//         bytes32 schemaUID = schemaRegistry.register(schema, resolver, revocable);
//         emit SchemaRegistered(schemaUID, schema, resolver, revocable);
//         return schemaUID;
//     }
// }
