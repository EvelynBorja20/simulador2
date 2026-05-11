// Variables Globales
let clientes = [];
let creditos = [];
let tasaInteresGlobal = 15;
let clienteSeleccionado = null;

// --- PARTE 1: NAVEGACIÓN ---
function ocultarSecciones() {
    let secciones = document.querySelectorAll("section");
    secciones.forEach(sec => {
        sec.classList.remove("activa");
    });
}

function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
}

// --- PARTE 2: CONFIGURAR TASA ---
function guardarTasa() {
    let valor = recuperarFloat("tasaInteres");
    if (valor >= 10 && valor <= 20) {
        tasaInteresGlobal = valor;
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + valor + "%");
        document.getElementById("mensajeTasa").style.color = "green";
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
        document.getElementById("mensajeTasa").style.color = "red";
    }
}

// --- PARTE 3: ADMINISTRACIÓN DE CLIENTES ---
function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i];
        }
    }
    return null;
}

function guardarCliente() {
    let ced = recuperaraTexto("cedula");
    let nom = recuperaraTexto("nombre");
    let ape = recuperaraTexto("apellido");
    let ing = recuperarFloat("ingresos");
    let egr = recuperarFloat("egresos");

    let existente = buscarCliente(ced);
    if (existente == null) {
        clientes.push({ cedula: ced, nombre: nom, apellido: ape, ingresos: ing, egresos: egr });
    } else {
        existente.nombre = nom;
        existente.apellido = ape;
        existente.ingresos = ing;
        existente.egresos = egr;
    }
    pintarClientes();
    limpiar();
}

function pintarClientes() {
    let tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = ""; 
    clientes.forEach(c => {
        tabla.innerHTML += `<tr>
            <td>${c.cedula}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.ingresos}</td>
            <td>${c.egresos}</td>
            <td><button onclick="seleccionarCliente('${c.cedula}')">Actualizar</button></td>
        </tr>`;
    });
}

function seleccionarCliente(cedula) {
    let c = buscarCliente(cedula);
    if (c) {
        mostrarTextoEnCaja("cedula", c.cedula);
        mostrarTextoEnCaja("nombre", c.nombre);
        mostrarTextoEnCaja("apellido", c.apellido);
        mostrarTextoEnCaja("ingresos", c.ingresos);
        mostrarTextoEnCaja("egresos", c.egresos);
    }
}

function limpiar() {
    mostrarTextoEnCaja("cedula", "");
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", "");
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");
}

// --- TALLER 2: LÓGICA DE CRÉDITOS ---

function buscarClienteCredito() {
    let ced = recuperaraTexto("buscarCedulaCredito");
    let cliente = buscarCliente(ced);
    let contenedor = document.getElementById("datosClienteCredito");

    if (cliente) {
        clienteSeleccionado = cliente; // Guardamos para el cálculo posterior
        // Armado dinámico según Parte 3 del Taller 2
        contenedor.innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${cliente.cedula}</p>
            <p><strong>Nombre:</strong> ${cliente.nombre}</p>
            <p><strong>Apellido:</strong> ${cliente.apellido}</p>
            <p><strong>Ingresos:</strong> ${cliente.ingresos}</p>
            <p><strong>Egresos:</strong> ${cliente.egresos}</p>
        `;
    } else {
        clienteSeleccionado = null;
        contenedor.innerHTML = "<p>Cliente no encontrado</p>";
    }
}

function calcularCredito() {
    if (!clienteSeleccionado) {
        alert("Primero busque y seleccione un cliente.");
        return;
    }

    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarInt("plazoCredito");
    let resultadoDiv = document.getElementById("resultadoCredito");

    // Fórmulas (Parte 4)
    let capacidadPago = (clienteSeleccionado.ingresos - clienteSeleccionado.egresos) * 0.4;
    let totalPagar = monto + (monto * (tasaInteresGlobal / 100));
    let cuotaMensual = totalPagar / plazo;

    let aprobado = cuotaMensual <= capacidadPago;

    // Estilos y Mensaje (Parte 5 y 6)
    resultadoDiv.className = aprobado ? "aprobado" : "rechazado";
    resultadoDiv.innerHTML = `
        Capacidad de pago: ${capacidadPago.toFixed(2)}<br>
        Total a pagar: ${totalPagar.toFixed(2)}<br>
        Cuota mensual: ${cuotaMensual.toFixed(2)}<br>
        RESULTADO: ${aprobado ? "APROBADO" : "RECHAZADO"}
    `;

    // Habilitar botón de solicitud si se calculó
    document.getElementById("btnSolicitarCredito").disabled = false;
}

function solicitarCredito() {
    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarInt("plazoCredito");
    let totalPagar = monto + (monto * (tasaInteresGlobal / 100));
    let cuota = (totalPagar / plazo).toFixed(2);

    creditos.push({
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido,
        monto: monto,
        tasa: tasaInteresGlobal,
        plazo: plazo,
        cuota: cuota
    });

    alert("Crédito registrado exitosamente");
    pintarCreditos();
    mostrarSeccion("listaCreditos");
}

function pintarCreditos() {
    let tabla = document.getElementById("tablaCreditos");
    tabla.innerHTML = "";
    creditos.forEach(cre => {
        tabla.innerHTML += `<tr>
            <td>${cre.cedula}</td>
            <td>${cre.nombre}</td>
            <td>${cre.apellido}</td>
            <td>${cre.monto}</td>
            <td>${cre.tasa}%</td>
            <td>${cre.plazo} meses</td>
            <td>${cre.cuota}</td>
        </tr>`;
    });
}

function buscarCreditosCliente() {
    let ced = recuperaraTexto("buscarCedulaListado");
    let filtrados = creditos.filter(c => c.cedula === ced);
    let tabla = document.getElementById("tablaCreditos");
    tabla.innerHTML = "";
    filtrados.forEach(cre => {
        tabla.innerHTML += `<tr>
            <td>${cre.cedula}</td><td>${cre.nombre}</td><td>${cre.apellido}</td>
            <td>${cre.monto}</td><td>${cre.tasa}%</td><td>${cre.plazo}</td><td>${cre.cuota}</td>
        </tr>`;
    });
}