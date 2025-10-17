const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (id) {
    buscarPorId(id);
}


function guardarFactura() {
    const factura = {
        cliente: document.getElementById('cliente').value,
        monto: document.getElementById('monto').value,
        estado: document.getElementById('estado').value,
    }
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (id) {
        // EDITAR
        axios.put('http://localhost:3000/api/facturas/'+id , factura, axiosConfig)
            .then(response => {
                cancelar();
            })
            .catch(error => {
                console.error('Error al guardar la factura:', error);
            });
    } else {
        // NUEVO
        axios.post('http://localhost:3000/api/facturas', factura, axiosConfig)
            .then(response => {
                cancelar();
            })
            .catch(error => {
                console.error('Error al guardar la factura:', error);
            });
    }
}

function cancelar() {
    window.location.href = 'facturas.html';
}

function buscarPorId(id) {
    axios.get(`http://localhost:3000/api/facturas/${id}`)
        .then(response => {
            const factura = response.data.data;
            document.getElementById('cliente').value = factura.cliente;
            document.getElementById('monto').value = factura.monto;
            document.getElementById('estado').value = factura.estado;
        })
        .catch(error => {
            console.error('Error al buscar la factura por ID:', error);
        });
}