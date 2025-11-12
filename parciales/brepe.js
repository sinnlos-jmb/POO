class Persona {
  #nombre;
  #dni;
  #edad;

  constructor(nombre, dni, edad) {
    this.#nombre = nombre;
    this.#dni = dni;
    this.#edad = edad;
  }

  getInfo() {
    return `Nombre: ${this.#nombre} | Edad: ${this.#edad}`;
  }
}

class Vendedor extends Persona {
  constructor(codigoEmpleado, sector, nombre, dni, edad) {
    super(nombre, dni, edad);
    this.codigoEmpleado = codigoEmpleado;
    this.sector = sector;
  }

  getInfoVendedor() {
    return `${super.getInfo()} | Código: ${this.codigoEmpleado} | Sector: ${this.sector}`;
  }
}

class Tecnico extends Persona {
  constructor(especialidad, turno, nombre, dni, edad) {
    super(nombre, dni, edad);
    this.especialidad = especialidad;
    this.turno = turno;
  }

  getInfoTecnico() {
    return `${super.getInfo()} | Especialidad: ${this.especialidad} | Turno: ${this.turno}`;
  }
}

class Cliente extends Persona {
  constructor(numCliente, categoria, nombre, dni, edad) {
    super(nombre, dni, edad);
    this.numCliente = numCliente;
    this.categoria = categoria;
  }

  getInfoCliente() {
    return `${super.getInfo()} | Nº Cliente: ${this.numCliente} | Categoría: ${this.categoria}`;
  }
}

// ==== CLASE ORDEN DE COMPRA ====
class OrdenDeCompra {
  constructor(cliente, vendedor) {
    this.cliente = cliente;
    this.vendedor = vendedor;
    this.fecha = new Date();
    this.items = [];
  }

  agregarItem(item) {
    this.items.push(item);
  }

  obtenerTotal() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.items[i].cantidad * this.items[i].precioUnitario;
    }
    return total;
  }

  detalleCompleto() {
    let texto = `\n ORDEN DE COMPRA\nFecha: ${this.fecha.toLocaleString()}\n`;
    texto += `Cliente: ${this.cliente.getInfoCliente()}\n`;
    texto += `Vendedor: ${this.vendedor.getInfoVendedor()}\n\n`;
    texto += `Items:\n`;

    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      texto += `- ${item.producto} x${item.cantidad} $${item.precioUnitario} c/u\n`;
    }

    texto += `\nTotal: $${this.obtenerTotal()}\n`;
    return texto;
  }
}

// ==== CLASE FERRETERÍA ====
class Ferreteria {
  constructor(nombre) {
    this.nombre = nombre;
    this.vendedores = [];
    this.tecnicos = [];
    this.clientes = [];
    this.ordenes = [];
  }

  registrarPersonal(persona) {
    if (persona instanceof Vendedor) {
      this.vendedores.push(persona);
    } else if (persona instanceof Tecnico) {
      this.tecnicos.push(persona);
    } else {
      console.log("Solo se pueden registrar Vendedores o Técnicos.");
    }
  }

  registrarCliente(cliente) {
    this.clientes.push(cliente);
  }

  crearOrden(cliente, vendedor) {
    let orden = new OrdenDeCompra(cliente, vendedor);
    this.ordenes.push(orden);
    return orden; 
  }

  agregarItemOrden(orden, item) {
    orden.agregarItem(item);
  }

  mostrarOrden(cliente) {
    let ordenCliente = this.ordenes.find(o => o.cliente === cliente);
    if (ordenCliente) {
      console.log(ordenCliente.detalleCompleto());
    } else {
      console.log("No se encontró ninguna orden para ese cliente.");
    }
  }

  listarVendedoresPorSector(sector) {
    let filtrados = this.vendedores.filter(v => v.sector === sector);
    console.log(`\n📋 Vendedores del sector "${sector}":`);
    filtrados.forEach(v => console.log(v.getInfoVendedor()));
  }
}

let ferre = new Ferreteria("Ferretería El Tornillo Feliz");

let vend1 = new Vendedor(1001, "Pintura", "Cornelio", 12345, 45);
let vend2 = new Vendedor(1002, "Electricidad", "María", 78945, 33);
let tec1 = new Tecnico("Electricidad", "Noche", "Carlos", 44455, 40);

ferre.registrarPersonal(vend1);
ferre.registrarPersonal(vend2);
ferre.registrarPersonal(tec1);

let cli1 = new Cliente(5001, "Particular", "Clara", 654123, 25);
ferre.registrarCliente(cli1);

let orden1 = ferre.crearOrden(cli1, vend1);


ferre.agregarItemOrden(orden1, { producto: "Pintura Blanca", cantidad: 2, precioUnitario: 2500 });
ferre.agregarItemOrden(orden1, { producto: "Brocha Grande", cantidad: 1, precioUnitario: 800 });

ferre.mostrarOrden(cli1);

ferre.listarVendedoresPorSector("Pintura");