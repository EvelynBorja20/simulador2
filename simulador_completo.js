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

// Función Buscar (Parte B)
function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i];
        }
    }
    return null;
}

// Función Seleccionar para Actualizar (Parte B)
function seleccionarCliente(cedula) {
    let cliente = buscarCliente(cedula);
    if (cliente != null) {
        clienteSeleccionado = cliente;
        mostrarTextoEnCaja("cedula", cliente.cedula);
        mostrarTextoEnCaja("nombre", cliente.nombre);
        mostrarTextoEnCaja("apellido", cliente.apellido);
        mostrarTextoEnCaja("ingresos", cliente.ingresos);
        mostrarTextoEnCaja("egresos", cliente.egresos);
    }
}

function guardarCliente() {
    let ced = recuperaraTexto("cedula");
    let nom = recuperaraTexto("nombre");
    let ape = recuperaraTexto("apellido");
    let ing = recuperarFloat("ingresos");
    let egr = recuperarFloat("egresos");

    let existente = buscarCliente(ced);

    if (existente == null) {
        // Crear nuevo
        let nuevoCliente = { 
            cedula: ced, nombre: nom, apellido: ape, 
            ingresos: ing, egresos: egr 
        };
        clientes.push(nuevoCliente);
    } else {
        // Actualizar existente
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
        // Uso de Strings Anidados según el taller
        let fila = `<tr>
            <td>${c.cedula}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.ingresos}</td>
            <td>${c.egresos}</td>
            <td>
                <button onclick="seleccionarCliente('${c.cedula}')">Actualizar</button>
            </td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

function limpiar() {
    mostrarTextoEnCaja("cedula", "");
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", "");
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");
    clienteSeleccionado = null;
}

// Lógica básica para secciones adicionales (Crédito)
function buscarClienteCredito() {
    let ced = recuperaraTexto("buscarCedulaCredito");
    let cliente = buscarCliente(ced);
    if (cliente) {
        mostrarTexto("datosClienteCredito", "Cliente: " + cliente.nombre + " " + cliente.apellido);
    } else {
        mostrarTexto("datosClienteCredito", "Cliente no encontrado");
    }
} 