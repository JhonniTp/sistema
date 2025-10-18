const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_nombre_propietario",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nombre_mascota",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_tratamiento",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_monto",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_estado",
				"type": "string"
			}
		],
		"name": "createFactura",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getFactura",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const contractAddress = '0x898e2688472E638Da8Fa1ac8a832c31C557b39E3';

module.exports = { contractABI, contractAddress };