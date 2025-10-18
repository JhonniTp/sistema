const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Inicializa la fecha de hoy si es un formulario nuevo
document.addEventListener('DOMContentLoaded', () => {
    if (!id) {
        document.getElementById('fecha_servicio').valueAsDate = new Date();
    } else {
        buscarPorId(id);
    }
});

function guardarFactura() {
    const factura = {
        nombre_propietario: document.getElementById('nombre_propietario').value,
        nombre_mascota: document.getElementById('nombre_mascota').value,
        tratamiento: document.getElementById('tratamiento').value,
        monto: document.getElementById('monto').value,
        fecha_servicio: document.getElementById('fecha_servicio').value,
        estado: document.getElementById('estado').value,
    };

    // Validacion simple
    if (!factura.nombre_propietario || !factura.nombre_mascota || !factura.monto || !factura.fecha_servicio) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (id) {
        // EDITAR
        axios.put('http://localhost:3000/api/facturas/' + id, factura, axiosConfig)
            .then(response => {
                cancelar();
            })
            .catch(error => {
                console.error('Error al actualizar la factura:', error);
                alert('Hubo un error al actualizar la factura.');
            });
    } else {
        // NUEVO
        axios.post('http://localhost:3000/api/facturas', factura, axiosConfig)
            .then(response => {
                cancelar();
            })
            .catch(error => {
                console.error('Error al guardar la factura:', error);
                alert('Hubo un error al guardar la factura.');
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
            document.getElementById('nombre_propietario').value = factura.nombre_propietario;
            document.getElementById('nombre_mascota').value = factura.nombre_mascota;
            document.getElementById('tratamiento').value = factura.tratamiento;
            document.getElementById('monto').value = factura.monto;
            // Formatear la fecha para el input type="date"
            document.getElementById('fecha_servicio').value = new Date(factura.fecha_servicio).toISOString().split('T')[0];
            document.getElementById('estado').value = factura.estado;
        })
        .catch(error => {
            console.error('Error al buscar la factura por ID:', error);
        });
}
