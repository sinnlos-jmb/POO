class Persona {
  #nombre;
  #dni;
  #edad; 
  constructor(nombre, dni, edad) {
    this.#nombre = nombre;
    this.#dni = dni;
    this.#edad = edad;
  }

  getNombre() { return this.#nombre; }
  set nombre(nuevoNombre) { this.#nombre = nuevoNombre; }

  getDni() { return this.#dni; }
  set dni(nuevoDni) { this.#dni = nuevoDni; }

  getEdad() { return this.#edad; }
  set edad(nuevaEdad) { this.#edad = nuevaEdad; }
}

class Vendedor extends Persona {
  constructor(nombre, dni, edad, codigoEmpleado, sector) {
    super(nombre, dni, edad);
    this.codigoEmpleado = codigoEmpleado;
    this.sector = sector;
  }

  realizarVenta(cliente, producto) {
    console.log(`Venta realizada por ${this.getNombre()} (${this.sector}) al cliente ${cliente.getNombre()}. Producto: ${producto}`);
  }
}

class Tecnico extends Persona {
  constructor(nombre, dni, edad, especialidad, turno) {
    super(nombre, dni, edad);
    this.especialidad = especialidad;
    this.turno = turno;
  }

  asesorarCliente(cliente, producto) {
    console.log(`El técnico ${this.getNombre()} (${this.especialidad}, turno ${this.turno}) asesora a ${cliente.getNombre()} sobre el producto: ${producto}.`);
  }
}

class Cliente extends Persona {
  constructor(nombre, dni, edad, numeroCliente, categoria) {
    super(nombre, dni, edad);
    this.numeroCliente = numeroCliente;
    this.categoria = categoria;
  }

  consultarProducto(nombreProducto) {
    return `El cliente ${this.getNombre()} consulta por el producto: ${nombreProducto}.`;
  }
}



/** 2) */

class OrdenDeCompra {
  
    constructor(cliente, fecha, items, vendedor) {
        this.cliente = cliente;
        this.vendedor = vendedor;
        this.fecha = new Date().toLocaleDateString();
        this.items = [];
    }
    agregarItem(producto, cantidad, precioUnitario) {
        const item = {producto, cantidad, precioUnitario}
        this.items.push(item);
    }

    obtenerTotal() {
        return this.items.reduce((total, item) => total + item.cantidad * item.precioUnitario, 0);
    }

    detalleCompleto() {
    let detalle = `ORDEN DE COMPRA\n`;
    detalle += `Cliente: ${this.cliente.getNombre()} (${this.cliente.categoria})\n`;
    detalle += `Vendedor: ${this.vendedor.getNombre()} (${this.vendedor.sector})\n`;
    detalle += `Fecha: ${this.fecha}\n\n`;
    detalle += `--- Detalle de productos ---\n`;

    this.items.forEach((item, index) => {
      detalle += `${index + 1}. ${item.producto} | Cantidad: ${item.cantidad} | Precio unitario: $${item.precioUnitario}\n`;
    });

    detalle += `\nTotal: $${this.obtenerTotal()}`;
    return detalle;
  }
}

class Ferreteria {
  constructor(nombre) {
    this.nombre = nombre;
    this.vendedores = [];
    this.tecnicos = [];
    this.clientes = [];
    this.ordenes = [];
  }
}
const vendedor1 = new Vendedor("Clara", "30111222", 30, "V001", "herramientas");
const tecnico1 = new Tecnico("Juan", "29888777", 40, "electricidad", "mañana");
const cliente1 = new Cliente("Luciano", "35666777", 45, "C123", "particular");

console.log(cliente1.consultarProducto("Taladro industrial"));
vendedor1.realizarVenta(cliente1, "Taladro industrial");
tecnico1.asesorarCliente(cliente1, "Taladro industrial");

const vendedor2 = new Vendedor("Laura", "30888999", 26, "V002", "pintura");
const cliente2 = new Cliente("Martín", "37222555", 33, "C124", "empresa");

const orden1 = new OrdenDeCompra(cliente2, "", "", vendedor2);

orden1.agregarItem("Pintura blanca", 3, 18000);
orden1.agregarItem("Rodillo", 2, 2500);

console.log(orden1.detalleCompleto());
 
/** 3) */

