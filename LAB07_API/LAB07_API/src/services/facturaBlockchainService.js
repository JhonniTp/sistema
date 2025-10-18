const Web3 = require('web3');
const { contractABI, contractAddress } = require("./facturaBlockchainContract");

const web3 = new Web3("http://127.0.0.1:7545");

class FacturaBlockchainService {

    static async createFactura(id, nombre_propietario, nombre_mascota, tratamiento, monto, estado, userAccount) {
        try {
            console.log("-- FacturaBlockchainService.createFactura --");
            const idNumber = Number(id);
            const montoNumber = Number(monto);
            
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            const receipt = await contract.methods.createFactura(
                idNumber, 
                nombre_propietario, 
                nombre_mascota,
                tratamiento,
                montoNumber, 
                estado
            ).send({ from: userAccount, gas: 3000000 });

            console.log("Factura creada en la blockchain. Receipt:", receipt.transactionHash);
            return receipt;
        } catch (error) {
            console.error("Error en createFactura BC Service:", error);
            const reason = error.message || "Error desconocido en la transacción.";
            throw new Error("Error en BC: " + reason);
        }
    }

    static async getFactura(id, userAccount) {
        try {
            console.log("-- FacturaBlockchainService.getFactura --");
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const factura = await contract.methods.getFactura(Number(id)).call({ from: userAccount });

            return {
                id: factura['0'],
                nombre_propietario: factura['1'],
                nombre_mascota: factura['2'],
                tratamiento: factura['3'],
                monto: factura['4'],
                estado: factura['5']
            };

        } catch (error) {
            console.error("Error en getFactura BC Service:", error);
            const reason = error.message || "La factura podría no existir o hubo un error en la red.";
            throw new Error("Error al consultar la blockchain: " + reason);
        }
    }
}

module.exports = FacturaBlockchainService;