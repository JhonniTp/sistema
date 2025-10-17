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
                <td>${factura.cliente}</td>
                <td>${factura.monto}</td>
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
    }
}

function nuevo() {
    window.location.href = 'facturas-form.html';
}

function editar(id) {
    window.location.href = 'facturas-form.html?id=' + id;
}

function registrarBlockChain(id) {
    const account = prompt("Ingrese la cuenta de blockchain para registrar la factura:");
    // console.log("Registrar en BC la factura ID:", id, "con la cuenta:", account);

    const facturaRow = document.querySelector(`#facturasBody tr:nth-child(${id})`);
    // console.log(facturaRow);
    const facturaId = facturaRow.children[0].textContent;
    const cliente = facturaRow.children[1].textContent;
    const monto = facturaRow.children[2].textContent;
    const estado = facturaRow.children[3].textContent;

    // console.log("Datos de la factura:", { facturaId, cliente, monto, estado });

    axios.post("http://localhost:3000/api/facturas/blockchain",
        { id: facturaId, cliente: cliente, monto: monto, estado: estado, account: account }
    ).then(response => {
        Swal.fire('Éxito', 'Factura registrada en blockchain correctamente', 'success');
    }).catch(error => {
        // console.error('Error al registrar en blockchain:', error);
        Swal.fire('Error', error.response.data.error);
    });
}

async function validarBlockChain(id) {
    try {
        Swal.fire({ title: 'Validando factura en blockchain...', didOpen: () => { Swal.showLoading() } });
        const account = prompt("Ingrese la cuenta de blockchain para validar la factura:");
        console.log("Validar en BC la factura ID:", id, "con la cuenta:", account);

        // Obtener factura desde la base de datos
        const localResponse = await axios.get(`http://localhost:3000/api/facturas/${id}`);
        const facturaLocal = localResponse.data.data;

        // Obtener factura desde la blockchain
        const blockchainResponse = await axios.get(`http://localhost:3000/api/facturas/blockchain/${id}/${account}`);
        const facturaBlockchain = blockchainResponse.data.data;

        // Comparar ambas facturas
        if (
            Number(facturaLocal.id) === Number(facturaBlockchain.id) &&
            facturaLocal.cliente === facturaBlockchain.cliente &&
            Number(facturaLocal.monto) === Number(facturaBlockchain.monto) &&
            facturaLocal.estado === facturaBlockchain.estado
        ) {
            Swal.fire({
                icon: 'success',
                title: 'Factura válida coincide con blockchain:',
                text: JSON.stringify(facturaBlockchain)

            });
        } else {
            Swal.fire(
                {
                    icon: 'error',
                    title: 'Factura inválida no coincide con blockchain:',
                    text: JSON.stringify(facturaBlockchain)
                });
        }

    } catch (error) {
        console.error(error.error);
        Swal.fire('Error', error.error);
    }
}
