const FacturaService = require('../services/facturaService');
const FacturaBlockchainService = require('../services/facturaBlockchainService');

class FacturaController {
    static getAll(req, res) {
        FacturaService.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, data: results, message: 'Facturas obtenidas exitosamente' });
        });
    }

    static getById(req, res) {
        const { id } = req.params;
        FacturaService.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
            res.json({ success: true, data: results[0], message: 'Factura obtenida exitosamente' });
        });
    }

    static create(req, res) {
        const newFactura = req.body;
        FacturaService.create(newFactura, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                success: true,
                data: { id: results.insertId, ...newFactura },
                message: 'Factura creada exitosamente'
            });
        });
    }

    static update(req, res) {
        const { id } = req.params;
        const facturaData = req.body;
        FacturaService.update(id, facturaData, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Factura no encontrada' });
            res.json({
                success: true,
                data: { id, ...facturaData },
                message: 'Factura actualizada exitosamente'
            });
        });
    }

    // BLOCKCHAIN
    static async createFacturaBlockchain(req, res) {
        const { id, nombre_propietario, nombre_mascota, tratamiento, monto, account } = req.body;
        const estadoProcesada = "PROCESADA";

        try {
            const receipt = await FacturaBlockchainService.createFactura(
                id, nombre_propietario, nombre_mascota, tratamiento, monto, estadoProcesada, account
            );

            const facturaDataToUpdate = { nombre_propietario, nombre_mascota, tratamiento, monto, estado: estadoProcesada, fecha_servicio: new Date() }; // Asumimos que la fecha se actualiza al procesar
            
            FacturaService.update(id, facturaDataToUpdate, (err, results) => {
                if (err) {
                    console.error("Error actualizando la BD local tras registro en BC:", err);
                    return res.status(500).json({ 
                        error: `Error al actualizar la base de datos local, pero la factura SÍ FUE REGISTRADA en blockchain. TxHash: ${receipt.transactionHash}` 
                    });
                }
                res.status(201).json({
                    success: true,
                    data: { id, transactionHash: receipt.transactionHash },
                    message: 'Factura registrada en Blockchain y actualizada localmente con éxito.'
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getFacturaBlockchain(req, res) {
        const { id, account } = req.params;
        try {
            console.log(`[Controller] Buscando en BC la factura ${id} con la cuenta ${account}`); // Log para depurar
            const factura = await FacturaBlockchainService.getFactura(id, account);
            
            // Verificamos si la respuesta es válida antes de enviarla
            if (!factura || factura.id == 0) {
                // Este caso ocurre si el contrato devuelve valores vacíos pero no un error.
                return res.status(404).json({ error: `La factura con ID ${id} no fue encontrada en la blockchain.` });
            }
            
            console.log(`[Controller] Factura encontrada en BC:`, factura); // Log para depurar
            res.json({ success: true, data: factura, message: 'Factura obtenida de la blockchain exitosamente' });

        } catch (error) {
            // Capturamos el error específico del servicio de blockchain y lo enviamos al frontend.
            console.error("[Controller] Error al obtener factura de BC:", error.message);
            
            // Devolvemos un error 500 pero con el mensaje de error real para que el frontend lo pueda mostrar.
            res.status(500).json({ error: `Error en el servidor al consultar la blockchain: ${error.message}` });
        }
    }
}

module.exports = FacturaController;

