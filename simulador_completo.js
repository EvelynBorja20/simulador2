// --- VARIABLES GLOBALES ---
let clientes = [];
let creditos = []; // Arreglo para el PASO 2
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
        if (clientes[i].cedula === cedula) return clientes[i];
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
        existente.nombre = nom; existente.apellido = ape;
        existente.ingresos = ing; existente.egresos = egr;
    }
    pintarClientes();
    limpiar();
}

function pintarClientes() {
    let tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = ""; 
    clientes.forEach(c => {
        let fila = `<tr>
            <td>${c.cedula}</td><td>${c.nombre}</td><td>${c.apellido}</td>
            <td>${c.ingresos}</td><td>${c.egresos}</td>
            <td><button onclick="seleccionarCliente('${c.cedula}')">Actualizar</button></td>
        </tr>`;
        tabla.innerHTML += fila;
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
    clienteSeleccionado = null;
}

// --- TALLER 2 Y 3: LÓGICA DE CRÉDITOS ---

function buscarClienteCredito() {
    let ced = recuperaraTexto("buscarCedulaCredito");
    let cliente = buscarCliente(ced);
    let contenedor = document.getElementById("datosClienteCredito");

    if (cliente) {
        clienteSeleccionado = cliente;
        contenedor.innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${cliente.cedula}</p>
            <p><strong>Nombre:</strong> ${cliente.nombre}</p>
            <p><strong>Apellido:</strong> ${cliente.apellido}</p>
            <p><strong>Ingresos:</strong> ${cliente.ingresos}</p>
            <p><strong>Egresos:</strong> ${cliente.egresos}</p>`;
    } else {
        clienteSeleccionado = null;
        contenedor.innerHTML = "<p>Cliente no encontrado</p>";
    }
}

function calcularCredito() {
    if (!clienteSeleccionado) {
        alert("Primero busque un cliente.");
        return;
    }

    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarInt("plazoCredito");
    let resultadoDiv = document.getElementById("resultadoCredito");

    let capacidadPago = (clienteSeleccionado.ingresos - clienteSeleccionado.egresos) * 0.4;
    let totalPagar = monto + (monto * (tasaInteresGlobal / 100));
    let cuotaMensual = totalPagar / plazo;

    let aprobado = cuotaMensual <= capacidadPago;

    resultadoDiv.className = aprobado ? "aprobado" : "rechazado";
    resultadoDiv.innerHTML = `
        Capacidad de pago: ${capacidadPago.toFixed(2)}<br>
        Total a pagar: ${totalPagar.toFixed(2)}<br>
        Cuota mensual: ${cuotaMensual.toFixed(2)}<br>
        RESULTADO: ${aprobado ? "APROBADO" : "RECHAZADO"}`;

    // PASO 2: Habilitar el botón solo si fue aprobado
    document.getElementById("btnSolicitarCredito").disabled = !aprobado;
}

// PASO 2: Función Asignar Crédito
function solicitarCredito() {
    let montoCalculado = recuperarFloat("montoCredito");
    let plazoIngresado = recuperarInt("plazoCredito");
    let totalPagar = montoCalculado + (montoCalculado * (tasaInteresGlobal / 100));
    let cuotaCalculada = (totalPagar / plazoIngresado).toFixed(2);

    // Estructura del objeto solicitada en el PASO 2
    let credito = {
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido,
        monto: montoCalculado,
        tasa: tasaInteresGlobal,
        plazo: plazoIngresado,
        cuota: cuotaCalculada
    };

    creditos.push(credito);
    alert("Crédito asignado correctamente");
    
    // Al asignar, mostramos todos (PASO 7) y cambiamos de sección
    pintarCreditos(creditos);
    mostrarSeccion("listaCreditos");
}

// PASO 4: Función buscarCreditos(cedula)
function buscarCreditos(cedula) {
    let filtrados = [];
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedula) {
            filtrados.push(creditos[i]);
        }
    }
    return filtrados;
}

// PASO 5: Función pintarCreditos(arreglo)
function pintarCreditos(arregloCreditos) {
    let tabla = document.getElementById("tablaCreditos");
    tabla.innerHTML = ""; // Limpiar tabla antes de pintar

    arregloCreditos.forEach(cre => {
        let fila = `<tr>
            <td>${cre.cedula}</td>
            <td>${cre.nombre}</td>
            <td>${cre.apellido}</td>
            <td>${cre.monto}</td>
            <td>${cre.tasa}%</td>
            <td>${cre.plazo}</td>
            <td>${cre.cuota}</td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

// PASO 6: Función buscarCreditosCliente
function buscarCreditosCliente() {
    // 1. Tomar valor de la cédula
    let cedulaCaja = recuperaraTexto("buscarCedulaListado");
    // 2. Invocar buscarCreditos
    let resultado = buscarCreditos(cedulaCaja);
    // 3. Enviar a pintarCreditos
    pintarCreditos(resultado);
}