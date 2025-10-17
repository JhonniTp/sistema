const db = require('../db');

class FacturaService {

    static getAll(callback) {
        db.query('SELECT * FROM facturas', callback)
    }

    static getById(id, callback) {
        db.query('SELECT * FROM facturas WHERE id = ?', [id], callback);
    }

    static create(cliente, monto, estado, callback) {
        db.query('INSERT INTO facturas (cliente,monto,estado) VALUES (?,?,?)', [cliente, monto, estado], callback);
    }

    static update(id, cliente, monto, estado, callback) {
        db.query('UPDATE facturas SET cliente = ?, monto = ?, estado = ? WHERE id = ?', [cliente, monto, estado, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM facturas WHERE id = ?', [id], callback);
    }
}

module.exports = FacturaService;