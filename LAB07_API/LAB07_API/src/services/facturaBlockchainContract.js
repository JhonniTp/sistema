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
				"name": "_cliente",
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
];

const contracAddress = '0x56122637A183Ba01E3dB4e6EDe9aD119539f01fd';

module.exports = { contractABI, contracAddress };