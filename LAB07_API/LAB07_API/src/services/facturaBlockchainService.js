const Web3 = require('web3');
const { contractABI, contracAddress } = require("./facturaBlockchainContract");

const web3 = new Web3("http://127.0.0.1:7545");

class FacturaBlockchainService {

    static async createFactura(id, cliente, monto, estado, userAccount) {
        try {
            console.log("\n--------------------------------------------------------");
            console.log("-- FacturaBlockchainService.createFactura --");
            console.log("Creando factura en la blockchain...");
            console.log("Parametros recibidos");
            console.log("id:", id, "tipo:", typeof id);
            console.log("cliente:", cliente, "tipo:", typeof cliente);
            console.log("monto:", monto, "tipo:", typeof monto);
            console.log("estado:", estado, "tipo:", typeof estado);
            console.log("userAccount:", userAccount, "tipo:", typeof userAccount);

            const idNumber = Number(id);
            const montoNumber = Number(monto);

            const contract = await new web3.eth.Contract(contractABI, contracAddress);

            const receipt = await contract.methods.createFactura(idNumber, cliente, montoNumber, estado)
                .send({ from: userAccount, gas: 3000000 });

            console.log("Factura creada en la blockchain. Receipt:", receipt);
            return receipt;

        } catch (error) {
            console.log(error);
            throw new Error("Error:" + error.data.reason);
        }
    }

    static async getFactura(id, userAccount) {
        try {
            console.log("\n--------------------------------------------------------");
            console.log("-- FacturaBlockchainService.getFactura --");
            console.log("id:", id, "tipo:", typeof id);
            console.log("userAccount:", userAccount, "tipo:", typeof userAccount);

            // Verificar si el contrato esta desplegado
            const contratoExiste = await web3.eth.getCode(contracAddress);
            if (contratoExiste === '0x') {
                throw new Error("El contrato no está desplegado en la red.");
            }

            // Verificar si la factura existe en la blockchain
            const contract = await new web3.eth.Contract(contractABI, contracAddress);
            const factura = await contract.methods.getFactura(Number(id)).call({ from: userAccount, gas: 2000000 });

            if (Array.isArray(factura)) {
                return {
                    id: factura[0],
                    cliente: factura[1],
                    monto: factura[2],
                    estado: factura[3]
                };
            } else {
                return {
                    id: factura['0'],
                    cliente: factura['1'],
                    monto: factura['2'],
                    estado: factura['3']
                }
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error:" + error.data.reason);
        }
    }


}

module.exports = FacturaBlockchainService;