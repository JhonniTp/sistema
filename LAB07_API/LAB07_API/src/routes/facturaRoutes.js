const express = require('express');
const FacturaController = require('../controllers/facturaController');

const router = express.Router();

// Rutas
router.get('/', FacturaController.getAll);
router.get('/:id', FacturaController.getById);
router.post('/', FacturaController.create);
router.put('/:id', FacturaController.update);


// Rutas BLOCKCHAIN
router.post('/blockchain', FacturaController.createFacturaBlockchain);
router.get('/blockchain/:id/:account', FacturaController.getFacturaBlockchain);


module.exports = router;