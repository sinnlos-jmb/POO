
class Persona {
    #nombre; #dni; #edad; 

    constructor(nombre, dni, edad) {
        this.#nombre = nombre;
        this.#dni = dni;
        this.#edad = edad;
    }

    // Getters y setters
    get nombre() { return this.#nombre; }
    set nombre(valor) { this.#nombre = valor; }

    get dni() { return this.#dni; }
    set dni(valor) { this.#dni = valor; }

    get edad() { return this.#edad; }
    set edad(valor) { this.#edad = valor; }

    mostrarDatos() {
        return `Nombre: ${this.#nombre}, DNI: ${this.#dni}, Edad: ${this.#edad}`;
    }
}

// Subclase vendedor
class Vendedor extends Persona {
    constructor(nombre, dni, edad, codigoEmpleado, sector) {
        super(nombre, dni, edad);
        this.codigoEmpleado = codigoEmpleado;
        this.sector = sector;
    }

    realizarVenta(cliente, producto) {
        console.log(`El vendedor ${this.nombre} realizó una venta al cliente ${cliente.nombre} del producto: ${producto}.`);
    }
}

// Subclase: Técnico
class Tecnico extends Persona {
    constructor(nombre, dni, edad, especialidad, turno) {
        super(nombre, dni, edad);
        this.especialidad = especialidad;
        this.turno = turno;
    }

    asesorarCliente(cliente, producto) {
        console.log(`El técnico ${this.nombre} (especialista en ${this.especialidad}) asesora al cliente ${cliente.nombre} sobre el producto: ${producto}.`);
    }
}

// Subclase: Cliente
class Cliente extends Persona {
    constructor(nombre, dni, edad, numeroCliente, categoria) {
        super(nombre, dni, edad);
        this.numeroCliente = numeroCliente;
        this.categoria = categoria;
    }

    consultarProducto(nombreProducto) {
        return `El cliente ${this.nombre} consulta por el producto: ${nombreProducto}.`;
    }
}


class OrdenDeCompra {
    constructor(cliente, vendedor, fecha) {
        this.cliente = cliente;
        this.vendedor = vendedor;
        this.fecha = fecha;
        this.items = [];
    }

    
    agregarItem(item) {
        this.items.push(item);
    }

    
    obtenerTotal() {
        return this.items.reduce((acum, item) => acum + (item.cantidad * item.precioUnitario), 0);
    }

   
    detalleCompleto() {
        let detalle = `\n===== ORDEN DE COMPRA =====\n`;
        detalle += `Fecha: ${this.fecha}\n`;
        detalle += `Cliente: ${this.cliente.nombre} (${this.cliente.categoria})\n`;
        detalle += `Vendedor: ${this.vendedor.nombre} (Sector: ${this.vendedor.sector})\n\n`;

        detalle += `--- Items ---\n`;
        this.items.forEach((item, index) => {
            detalle += `${index + 1}. ${item.producto} - Cantidad: ${item.cantidad} - Precio Unitario: $${item.precioUnitario}\n`;
        });

        detalle += `\n💵 Total a pagar: $${this.obtenerTotal()}`;
        detalle += `\n===========================\n`;
        return detalle;
    }
}



// Ejem.
let vendedor1 = new Vendedor("Marcos", "34567890", 35, "V001", "pintura");
const tecnico1 = new Tecnico("Laura", "40123456", 29, "electricidad", "mañana");
let cliente1 = new Cliente("Pedro", "39876543", 40, "C100", "particular");

// Probamos los métodos
console.log(vendedor1.mostrarDatos());
console.log(tecnico1.mostrarDatos());
console.log(cliente1.mostrarDatos());

vendedor1.realizarVenta(cliente1, "Taladro percutor");
tecnico1.asesorarCliente(cliente1, "zapatilla para compu");
console.log(cliente1.consultarProducto("Pintura para pisos"));


// Ejemplo de cliente y vendedor (suponiendo que las clases ya existen)
vendedor1 = { nombre: "Marcos", sector: "Pintura" };
cliente1 = { nombre: "Pedro", categoria: "Particular" };


let orden1 = new OrdenDeCompra(cliente1, vendedor1, "15/10/2025");

// Agregar productos
orden1.agregarItem({ producto: "Pintura látex 4L", cantidad: 2, precioUnitario: 5500 });
orden1.agregarItem({ producto: "Rodillo profesional", cantidad: 1, precioUnitario: 3200 });
orden1.agregarItem({ producto: "Cinta de enmascarar", cantidad: 3, precioUnitario: 800 });

// Mostrar el detalle de la orden
console.log(orden1.detalleCompleto());


const ferre = new Ferreteria("Ferretería Central");

// Crear personal y cliente (suponiendo que las clases ya existen)
const v1 = new Vendedor("Carlos", "123", 30, "V001", "Pintura");
const t1 = new Tecnico("Laura", "456", 28, "Electricidad", "Mañana");
const c1 = new Cliente("Mario", "789", 45, "C100", "Particular");

// Registrar personal y cliente
ferre.registrarPersonal(v1);
ferre.registrarPersonal(t1);
ferre.registrarCliente(c1);

// Crear una orden de compra
orden1 = ferre.crearOrden(c1, v1, "15/10/2025");

// Agregar productos a la orden
ferre.agregarItemOrden(orden1, { producto: "Pintura látex 4L", cantidad: 2, precioUnitario: 5500 });
ferre.agregarItemOrden(orden1, { producto: "Rodillo profesional", cantidad: 1, precioUnitario: 3200 });

// Mostrar la orden completa
ferre.mostrarOrden(c1);

// Listar vendedores de un sector
ferre.listarVendedoresPorSector("Pintura");