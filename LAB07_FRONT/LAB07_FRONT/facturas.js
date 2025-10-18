window.addEventListener('load', buscarFacturas);

async function buscarFacturas() {
    try {
        Swal.fire({ title: 'Cargando facturas...', didOpen: () => { Swal.showLoading() } });
        const response = await axios.get("http://localhost:3000/api/facturas");
        Swal.close();
        const facturas = response.data.data;

        const tbody = document.getElementById('facturasBody');
        tbody.innerHTML = ''; // Limpiar el contenido existente
        facturas.forEach(factura => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${factura.id}</td>
                <td>${factura.nombre_propietario}</td>
                <td>${factura.nombre_mascota}</td>
                <td>${factura.tratamiento}</td>
                <td>${factura.monto}</td>
                <td>${new Date(factura.fecha_servicio).toLocaleDateString()}</td>
                <td>${factura.estado}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info" onclick="editar(${factura.id})">✏️ EDITAR</button>
                    <button class="btn btn-sm btn-success" onclick="registrarBlockChain(${factura.id})">REGISTRAR BC</button>
                    <button class="btn btn-sm btn-danger" onclick="validarBlockChain(${factura.id})">VALIDAR BC</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al buscar facturas:', error);
        Swal.fire('Error', 'No se pudieron cargar las facturas.', 'error');
    }
}

function nuevo() {
    window.location.href = 'facturas-form.html';
}

function editar(id) {
    window.location.href = 'facturas-form.html?id=' + id;
}

// === FUNCIÓN PARA VALIDAR DIRECCIÓN DE ETHEREUM ===
function esDireccionValida(direccion) {
    return /^0x[a-fA-F0-9]{40}$/.test(direccion);
}

async function registrarBlockChain(id) {
    const { value: account } = await Swal.fire({
        title: 'Registrar en Blockchain',
        input: 'text',
        inputLabel: 'Ingrese su CUENTA PÚBLICA (0x...)',
        inputPlaceholder: 'Ej: 0x123...abc',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return '¡Necesita ingresar una cuenta!';
            }
            if (!esDireccionValida(value)) {
                return 'La dirección no es válida. Debe empezar con 0x y tener 42 caracteres.';
            }
        }
    });

    if (!account) {
        Swal.fire('Cancelado', 'La operación fue cancelada.', 'info');
        return;
    }

    try {
        Swal.fire({ title: 'Registrando en Blockchain...', didOpen: () => { Swal.showLoading() } });

        const response = await axios.get(`http://localhost:3000/api/facturas/${id}`);
        const factura = response.data.data;

        const datosParaBlockchain = {
            id: factura.id,
            nombre_propietario: factura.nombre_propietario,
            nombre_mascota: factura.nombre_mascota,
            tratamiento: factura.tratamiento,
            monto: factura.monto,
            account: account
        };
        
        console.log("Enviando estos datos para registrar:", datosParaBlockchain);

        // 1. Capturamos la respuesta del servidor
        const registroResponse = await axios.post("http://localhost:3000/api/facturas/blockchain", datosParaBlockchain);
        
        // 2. Obtenemos el ID de la transacción (Hash) desde la respuesta
        const transactionHash = registroResponse.data.data.transactionHash;

        Swal.close();
        
        console.log("Registro exitoso. TxHash:", transactionHash); // <-- NUEVO LOG

        // 3. Mostramos un mensaje de éxito mucho más detallado
        Swal.fire({
            icon: 'success',
            title: '¡Registro Exitoso en Blockchain!',
            html: `La factura fue registrada correctamente.<br><br>
                   <div style="text-align:left; font-family: monospace; word-break: break-all;">
                       <b>ID de Transacción (TxHash):</b><br> 
                       ${transactionHash}
                   </div>`,
            footer: 'Este ID es la prueba inmutable de tu registro.'
        });
        
        buscarFacturas(); 

    } catch (error) {
        console.error('Error al registrar en blockchain:', error);
        const mensajeError = error.response?.data?.error || 'Ocurrió un error desconocido.';
        Swal.fire('Error', mensajeError, 'error');
    }
}


async function validarBlockChain(id) {
    const { value: account } = await Swal.fire({
        title: 'Validar en Blockchain',
        input: 'text',
        inputLabel: 'Ingrese su CUENTA PÚBLICA (0x...) para validar',
        inputPlaceholder: 'Ej: 0x123...abc',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return '¡Necesita ingresar una cuenta!';
            }
            if (!esDireccionValida(value)) {
                return 'La dirección no es válida. Debe empezar con 0x y tener 42 caracteres.';
            }
        }
    });

    if (!account) {
        Swal.fire('Cancelado', 'La operación fue cancelada.', 'info');
        return;
    }

    try {
        Swal.fire({ title: 'Validando factura en blockchain...', didOpen: () => { Swal.showLoading() } });
        
        console.log(`Validando factura con ID: ${id} usando la cuenta: ${account}`); // <-- NUEVO LOG
        
        const localResponse = await axios.get(`http://localhost:3000/api/facturas/${id}`);
        const facturaLocal = localResponse.data.data;
        
        console.log("Datos de la factura en la BD local:", facturaLocal); // <-- NUEVO LOG

        const blockchainResponse = await axios.get(`http://localhost:3000/api/facturas/blockchain/${id}/${account}`);
        const facturaBlockchain = blockchainResponse.data.data;
        
        console.log("Datos recibidos desde la Blockchain:", facturaBlockchain); // <-- NUEVO LOG

        Swal.close();

        if (
            Number(facturaLocal.id) === Number(facturaBlockchain.id) &&
            facturaLocal.nombre_propietario === facturaBlockchain.nombre_propietario &&
            facturaLocal.nombre_mascota === facturaBlockchain.nombre_mascota &&
            facturaLocal.tratamiento === facturaBlockchain.tratamiento &&
            Number(facturaLocal.monto) === Number(facturaBlockchain.monto) &&
            facturaBlockchain.estado // Verificamos que el estado exista en la respuesta de BC
        ) {
            Swal.fire({
                icon: 'success',
                title: '¡Factura Válida!',
                html: `Los datos locales coinciden con los de la blockchain:<br><pre style="text-align: left; font-size: 12px;">${JSON.stringify(facturaBlockchain, null, 2)}</pre>`
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '¡Factura Inválida!',
                html: `Los datos no coinciden.<br><b>Local:</b><pre style="text-align: left; font-size: 12px;">${JSON.stringify(facturaLocal, null, 2)}</pre><b>Blockchain:</b><pre style="text-align: left; font-size: 12px;">${JSON.stringify(facturaBlockchain, null, 2)}</pre>`
            });
        }

    } catch (error) {
        console.error('Error al validar con blockchain:', error);
        const mensajeError = error.response?.data?.error || 'No se pudo validar la factura en la blockchain.';
        Swal.fire('Error', mensajeError, 'error');
    }
}
