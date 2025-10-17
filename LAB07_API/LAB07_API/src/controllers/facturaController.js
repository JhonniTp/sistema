const FacturaService = require('../services/facturaService');
const FacturaBlockchainService = require('../services/facturaBlockchainService');

class FacturaController {
    static getAll(req, res) {
        FacturaService.getAll(
            (err, results) => {
                if(err){
                    return res.status(500).json({ error: err.message });
                }
                res.json(
                    {
                        success: true,
                        data: results,
                        message: 'Facturas obtenias exitosamente'
                    }

                );
            }
        );
    }
    static getById(req, res) {
        const { id } = req.params;
        FacturaService.getById(id,
            (err, results) => {
                if(err){
                    return res.status(500).json({ error: err.message });
                }
                if(results.length === 0){
                    return res.status(404).json({ error: 'Factura no encontrada' });
                }
                res.json(
                    {
                        success: true,
                        data: results[0],
                        message: 'Factura obtenida exitosamente'
                    }
                );
            }
        );
    }
    static create(req, res) {
        const { cliente, monto, estado } = req.body;
        FacturaService.create(cliente, monto, estado,
            (err, results) => {
                if(err){
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json(
                    {
                        success: true,
                        data: { id: results.insertId, cliente, monto, estado },
                        message: 'Factura creada exitosamente'
                    }
                );
            }
        );
    }
    static update(req, res){
        const { id } = req.params;
        const { cliente, monto, estado } = req.body;
        FacturaService.update(id, cliente, monto, estado,
            (err, results) => {
                if(err){
                    return res.status(500).json({ error: err.message });
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({ error: 'Factura no encontrada' });
                }
                res.json(
                    {
                        success: true,
                        data: { id, cliente, monto, estado },
                        message: 'Factura actualizada exitosamente'
                    }
                );
            }
        );
    }

    // BLOCKCHAIN
    static async createFacturaBlockchain(req, res) {
        console.log("\n--------------------------------------------------------");
        console.log("-- FacturaController.createFacturaBlockchain --");
        console.log("Creando factura en la blockchain desde el controlador...");
        console.log("Cuerpo de la solicitud:", req.body);
        const { id, cliente, monto, estado, account } = req.body;
        try{
            const receipt = await FacturaBlockchainService.createFactura(id, cliente, monto, "PROCESADA", account);
            console.log("Respuesta del servicio de blockchain:", receipt);

            // Actualizar el estado de la factura en la base de datos local
            FacturaService.update(id, cliente, monto, "PROCESADA",
                (err, results) => {
                    if(err){
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json(
                        {
                            success: true,
                            data: { id, cliente, monto, estado: "PROCESADA", transactionHash: receipt.transactionHash },
                            message: 'Factura creada en la blockchain y actualizada en la base de datos local exitosamente'
                        }
                    );
                }
            );
        }
        catch(error){
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getFacturaBlockchain(req, res) {
        console.log("\n--------------------------------------------------------");
        console.log("-- FacturaController.getFacturaBlockchain --");
        const { id, account } = req.params;
        try{
            const factura = await FacturaBlockchainService.getFactura(id, account);
            console.log("Factura obtenida de la blockchain:", factura);
            if(!factura || factura.id == 0){
                return res.status(404).json({ error: 'Factura no encontrada en la blockchain' });
            }

            res.json(
                {
                    success: true,
                    data: factura,
                    message: 'Factura obtenida de la blockchain exitosamente'
                }
            );
        }
        catch(error){
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = FacturaController;