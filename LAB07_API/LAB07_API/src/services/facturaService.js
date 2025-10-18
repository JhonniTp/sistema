const db = require('../db');

class FacturaService {

    static getAll(callback) {
        db.query('SELECT * FROM facturas ORDER BY fecha_servicio DESC, id DESC', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM facturas WHERE id = ?', [id], callback);
    }

    static create(facturaData, callback) {
        const { nombre_propietario, nombre_mascota, tratamiento, monto, fecha_servicio, estado } = facturaData;
        db.query(
            'INSERT INTO facturas (nombre_propietario, nombre_mascota, tratamiento, monto, fecha_servicio, estado) VALUES (?, ?, ?, ?, ?, ?)', 
            [nombre_propietario, nombre_mascota, tratamiento, monto, fecha_servicio, estado], 
            callback
        );
    }

    static update(id, facturaData, callback) {
        const { nombre_propietario, nombre_mascota, tratamiento, monto, fecha_servicio, estado } = facturaData;
        db.query(
            'UPDATE facturas SET nombre_propietario = ?, nombre_mascota = ?, tratamiento = ?, monto = ?, fecha_servicio = ?, estado = ? WHERE id = ?', 
            [nombre_propietario, nombre_mascota, tratamiento, monto, fecha_servicio, estado, id], 
            callback
        );
    }

    static delete(id, callback) {
        db.query('DELETE FROM facturas WHERE id = ?', [id], callback);
    }
}

module.exports = FacturaService;
