class Persona {
    constructor(nombre, dni, edad) {
        this._nombre = nombre;
        this._dni = dni;
        this._edad = edad;
    }

    get nombre() {
        return this._nombre;
    }
    set nombre(nombre) {
        this._nombre = nombre;
    }

    get dni() {
        return this._dni;
    }
    set dni(dni) {
        this._dni = dni;
    }
    
    get edad() {
        return this._edad;
    }
    set edad(edad) {
        this._edad = edad;
    }

    getInfo() {
        return `Nombre: ${this.nombre}, DNI: ${this.dni}, Edad: ${this.edad}`;
    }
}

class Vendedor extends Persona {
    constructor(nombre, dni, edad, codigoEmpleado, sector) {
        super(nombre, dni, edad);
        this._codigoEmpleado = codigoEmpleado;
        this._sector = sector;
    }
    
    get codigoEmpleado() {
        return this._codigoEmpleado;
    }
    set codigoEmpleado(codigoEmpleado) {
        this._codigoEmpleado = codigoEmpleado;
    }

    get sector() {
        return this._sector;
    }
    set sector(sector) {
        this._sector = sector;
    }
    
    realizarVenta(cliente, producto) {
        console.log(`Vendedor ${this.nombre} (${this.sector}) realizó una venta a ${cliente.nombre} del producto: ${producto}.`);
    }
    
    getInfo() {
        return `${super.getInfo()}, Código Empleado: ${this.codigoEmpleado}, Sector: ${this.sector}`;
    }
}

class Tecnico extends Persona {
    constructor (nombre, dni, edad, especialidad, turno) {
        super(nombre, dni, edad);
        this._especialidad = especialidad;
        this._turno = turno;
    }
    
    set especialidad(especialidad) {
        this._especialidad = especialidad;
    }
    get especialidad(){
        return this._especialidad;
    }

    set turno(turno) {
        this._turno = turno;
    }
    get turno (){
        return this._turno;
    }

    asesorarCliente(cliente, producto) {
        console.log(`El técnico ${this.nombre} (${this.especialidad}) asesoró al cliente ${cliente.nombre} sobre el producto: ${producto}.`);
    }

    getInfo() {
        return `${super.getInfo()}, Especialidad: ${this.especialidad}, Turno: ${this.turno}`;
    }
}

class Cliente extends Persona {
    constructor (nombre, dni, edad, numeroCliente, categoria) { 
        super(nombre, dni, edad);
        this._numeroCliente = numeroCliente;
        this._categoria = categoria;
    }

    set numeroCliente(numeroCliente){
        this._numeroCliente = numeroCliente;
    }
    get numeroCliente() {
        return this._numeroCliente;
    }

    set categoria(categoria){
        this._categoria = categoria;
    }
    get categoria (){
        return this._categoria;
    }

    getInfo() {
        return `${super.getInfo()}, N° Cliente: ${this.numeroCliente}, Categoría: ${this.categoria}`;
    }

    consultarProducto (nombreProducto) {
        return `El cliente ${this.nombre} consultó el producto ${nombreProducto}.`;
    }
}

class Producto {
    constructor(nombre, descripcion, precio) {
        this._nombre = nombre;
        this._descripcion = descripcion;
        this._precio = precio;
    }
    
    get nombre() {
        return this._nombre;
    }
    set nombre(nombre) {
        this._nombre = nombre;
    }

    get descripcion() {
        return this._descripcion;
    }
    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }

    get precio() {
        return this._precio;
    }
    set precio(precio) {
        this._precio = precio;
    }

    getInfo() {
        return `Producto: ${this.nombre}, Descripción: ${this.descripcion}, Precio: ${this.precio}`;
    }
}


///////////////////////////////////////////////////////////////////////
//parte2:
class OrdenDeCompra {
    constructor (cliente, fecha, items =[], vendedor) {
        this.cliente = cliente;
        this.fecha = fecha;
        this.items = items;
        this.vendedor = vendedor;
    }

    agregarItem(item) {
        this.items.push(item);
    }

    obtenerTotal() {
        return this.items.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
    }

    detalleCompleto() {
        let detalle = `Orden de Compra\nCliente: ${this.cliente.nombre}\nFecha: ${this.fecha}\nVendedor: ${this.vendedor.nombre}\nItems:\n`;
        this.items.forEach(item => {
            detalle += `- Producto: ${item.producto.nombre}, Cantidad: ${item.cantidad}, Precio Unitario: ${item.precioUnitario}\n`;
        });
        detalle += `Total: ${this.obtenerTotal()}`;
        return detalle;
        
    }
}


/////////////////////////////////////////////////////////////////
//parte3:

class Ferreteria {
    constructor (nombre) {
        this.nombre = nombre;
        this.vendedores = [];
        this.tecnicos = [];
        this.clientes = [];
        this.ordenes = [];
    }
    
    registrarPersonal (persona) {
        if (persona instanceof Vendedor) {
            this.vendedores.push(persona);
            console.log(`Vendedor ${persona.nombre} se registró en ${this.nombre}.`);
        } else if (persona instanceof Tecnico) {
            this.tecnicos.push(persona);
            console.log(`Técnico ${persona.nombre} se registó en ${this.nombre}.`);
        } else {
            console.warn("error");
        }
    }

    registrarCliente (cliente) {
        this.clientes.push(cliente);
        console.log(`Cliente ${cliente.nombre} registrado.`);
    }

    crearOrden (cliente, vendedor) {

    }

    agregarItemOrden (orden, item) {

    }

    mostrarOrden (cliente) {
    }

    listarVendedoresPorSector (sector) {
    }

}


///////////////////////////////////////////////////////////////////
//carga de datos

const ferre = new Ferreteria("Ferretería Central");
const v1 = new Vendedor("Carlos", "123", 30, "V001", "pintura");
const v2 = new Vendedor("Ana", "124", 25, "V002", "pintura"); 
const t1 = new Tecnico("Laura", "456", 28, "electricidad", "mañana");
const c1 = new Cliente("Mario", "789", 45, "C100", "particular"); 

const p1 = new Producto("Taladro", "Taladro eléctrico de 500W", 15000);
const p2 = new Producto("Pintura", "Pintura látex blanca 10L", 8000);

ferre.registrarPersonal(v1);
ferre.registrarPersonal(v2);
ferre.registrarPersonal(t1);
ferre.registrarCliente(c1);



console.log(c1.consultarProducto(p1.nombre));
t1.asesorarCliente(c1, p1.nombre);