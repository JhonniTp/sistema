// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FacturaStorage {
    struct Factura {
        uint id;
        string cliente;
        uint monto;
        string estado;
    }

    mapping(uint => Factura) private facturas;

    // Crear una factura con id externo (de la base de datos)
    function createFactura(
        uint _id, 
        string memory _cliente, 
        uint _monto, 
        string memory _estado
    ) public {
        // Evitar sobreescribir una factura existente
        require(facturas[_id].id == 0, "Factura ya existe en blockchain");
        facturas[_id] = Factura(_id, _cliente, _monto, _estado);
    }

    // Leer factura por ID
    function getFactura(uint _id) public view returns (uint, string memory, uint, string memory) {
        Factura memory f = facturas[_id];
        require(f.id != 0, "Factura no existe");
        return (f.id, f.cliente, f.monto, f.estado);
    }
}
