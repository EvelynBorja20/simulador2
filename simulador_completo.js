// --- VARIABLES GLOBALES ---
let clientes = [];
let creditos = []; 
let tasaInteresGlobal = 15;
let montoMaximoGlobal = 50000; 
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

// --- PARTE 2: CONFIGURAR TASA Y PARÁMETROS ---
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

// REQUERIMIENTO 2: Configurar y registrar el tope máximo
function guardarMontoMaximo() {
    let maximo = recuperarFloat("montoMaximoInput");
    if (maximo > 0) {
        montoMaximoGlobal = maximo;
        mostrarTexto("mensajeMontoMax", "Monto máximo configurado en: $" + maximo.toFixed(2));
        document.getElementById("mensajeMontoMax").style.color = "green";
    } else {
        mostrarTexto("mensajeMontoMax", "Ingrese un monto superior a 0");
        document.getElementById("mensajeMontoMax").style.color = "red";
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
    let tel = recuperaraTexto("telefono"); // REQUERIMIENTO 1: Captura de teléfono
    let ing = recuperarFloat("ingresos");
    let egr = recuperarFloat("egresos");

    let existente = buscarCliente(ced);
    if (existente == null) {
        // REQUERIMIENTO 1: Guardamos el atributo teléfono
        clientes.push({ cedula: ced, nombre: nom, apellido: ape, telefono: tel, ingresos: ing, egresos: egr });
    } else {
        existente.nombre = nom; 
        existente.apellido = ape;
        existente.telefono = tel; // REQUERIMIENTO 1: Actualización de teléfono
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
        let fila = `<tr>
            <td>${c.cedula}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.telefono}</td> <td>${c.ingresos.toFixed(2)}</td>
            <td>${c.egresos.toFixed(2)}</td>
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
        mostrarTextoEnCaja("telefono", c.telefono); // REQUERIMIENTO 1
        mostrarTextoEnCaja("ingresos", c.ingresos);
        mostrarTextoEnCaja("egresos", c.egresos);
    }
}

function limpiar() {
    mostrarTextoEnCaja("cedula", ""); 
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", ""); 
    mostrarTextoEnCaja("telefono", ""); // REQUERIMIENTO 1
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");
    clienteSeleccionado = null;
}

// --- LÓGICA DE CRÉDITOS ---

function buscarClienteCredito() {
    let ced = recuperaraTexto("buscarCedulaCredito");
    let cliente = buscarCliente(ced);
    let contenedor = document.getElementById("datosClienteCredito");

    if (cliente) {
        clienteSeleccionado = cliente;
        contenedor.innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${cliente.cedula} | <strong>Teléfono:</strong> ${cliente.telefono}</p> <p><strong>Nombre:</strong> ${cliente.nombre}</p>
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

    // REQUERIMIENTO 2: Validación del parámetro de Monto Máximo
    if (monto > montoMaximoGlobal) {
        alert("ERROR: El monto solicitado supera el valor máximo permitido por el sistema ($" + montoMaximoGlobal + ").");
        mostrarTextoEnCaja("montoCredito", ""); // Requerimiento: Limpiar la caja de texto
        document.getElementById("btnSolicitarCredito").disabled = true;
        document.getElementById("resultadoCredito").innerHTML = "";
        return; // Detiene la ejecución
    }

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

    document.getElementById("btnSolicitarCredito").disabled = !aprobado;
}

function solicitarCredito() {
    let montoCalculado = recuperarFloat("montoCredito");
    let plazoIngresado = recuperarInt("plazoCredito");
    let totalPagar = montoCalculado + (montoCalculado * (tasaInteresGlobal / 100));
    let cuotaCalculada = (totalPagar / plazoIngresado).toFixed(2);

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
    
    pintarCreditos(creditos);
    mostrarSeccion("listaCreditos");
}

function buscarCreditos(cedula) {
    let filtrados = [];
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedula) {
            filtrados.push(creditos[i]);
        }
    }
    return filtrados;
}

function pintarCreditos(arregloCreditos) {
    let tabla = document.getElementById("tablaCreditos");
    tabla.innerHTML = ""; 

    arregloCreditos.forEach(cre => {
        let fila = `<tr>
            <td>${cre.cedula}</td>
            <td>${cre.nombre}</td>
            <td>${cre.apellido}</td>
            <td>$${cre.monto.toFixed(2)}</td>
            <td>${cre.tasa}%</td>
            <td>${cre.plazo} meses</td>
            <td>$${cre.cuota}</td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

function buscarCreditosCliente() {
    let cedulaCaja = recuperaraTexto("buscarCedulaListado");
    let resultado = buscarCreditos(cedulaCaja);
    pintarCreditos(resultado);
}

// REQUERIMIENTO 3: Función para filtrar créditos mayores a 5000 (VIP)
function mostrarCreditosVIP() {
    let vipFiltrados = [];
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].monto > 5000) {
            vipFiltrados.push(creditos[i]);
        }
    }
    // Mostramos únicamente los resultados que superan el filtro en la tabla
    pintarCreditos(vipFiltrados);
}