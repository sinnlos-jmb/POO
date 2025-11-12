class persona{
    constructor(nombre, dni, edad){
        this._nombre = nombre;
        this._dni = dni;
        this._edad = edad;
    }
    get nombre (){
        return this._nombre;
    }
    set nombre(nuevoNombre){
        this._nombre = nuevoNombre;
    }
    get dni(){
        return  this._dni;
    }
    set dni(nuevoDni){
        this._dni = nuevoDni;
    }
    get edad(){
        return this._edad;
    }
    set edad(nuevaEdad){
        if (nuevaEdad > 0) {
            this._edad = nuevaEdad;
        }
    }
    getInfo(){
        return `Nombre: ${this._nombre}, DNI: ${this._dni}, edad: ${this._edad}`;
    }
}
class vendedor extends persona{
    constructor(nombre, dni, edad, codigoEmpleado,sector){
        super(nombre, dni, edad);
        this._codigoEmpleado = codigoEmpleado;
        this._sector = sector;
    }
    get codigoEmpleado(){
        return this._codigoEmpleado;
    }
    set codigoEmpleado(legajo){
        this._codigoEmpleado = legajo;
    }
    get sector(){
        return this._sector;
    }
    set sector(nuevoSector){
        this._sector = nuevoSector;
    }
    getInfo(){
        return `Info del vendedor ${super.getInfo()}, legajo: ${this._codigoEmpleado}, sector: ${this._sector} `;
    }

    // Método venta cliente // 
     realizarVenta(cliente, producto) {
        return `${this._nombre} realizó una venta a ${cliente.nombre} del producto ${producto}`;
    }
}
class tecnico extends persona{
    constructor(nombre, dni, edad, especialidad, turno){
        super(nombre, dni, edad);
        this._especialidad = especialidad;
        this._turno = turno;
    }
    get especialidad(){
        return this._especialidad;
    }
    set especialidad(nuevaEspecialidad){
        this._especialidad = nuevaEspecialidad;
    }
    get turno(){
        return this._turno;
    }
    set turno (nuevoTurno){
        this._turno = nuevoTurno;
    }
    getInfo(){
        return `Técnico:${super.getInfo()}, especialidad: ${this._especialidad}, turno: ${this.turno}`;
    }
    // Método para asesorar cliente // 
    asesorarCliente(cliente, producto, consulta){
        return`El técnico ${this._nombre}, especializado en ${this._especialidad} está asesorando el siguiente problema: ${consulta} del cliente ${cliente.nombre} sobre el producto ${producto}`;
    }

}
class cliente extends persona {
    constructor(nombre, dni, edad, numeroCliente, categoria){
        super(nombre, dni, edad);
        this._numeroCliente = numeroCliente;
        this._categoria = categoria;
    }
    get numeroCliente(){
        return this._numeroCliente;
    }
    set numeroCliente(nuevoCliente){
        this._numeroCliente = nuevoCliente;
    }
    get categoria(){
        return this._categoria;
    }
    set categoria (nuevaCategoria){
        this._categoria = nuevaCategoria;
    }
    getInfo(){
        return `${super.getInfo()}, Número del cliente: ${this._numeroCliente}, categoria: ${this._categoria}`;
    }
    // Método consulta cliente // 
    consultaCliente(tecnico, producto, problema) {
        return `Cliente ${this._nombre}: "Hola buenas tardes, necesito asesoramiento del técnico ${tecnico.nombre} si es posible, sobre el producto ${producto} que tengo este problema: ${problema}"`;
    }
    consultaProducto(nombreProducto) {
    const consultas = [
        `Hola, necesito información sobre ${nombreProducto}`,
        `¿Podrían asesorarme acerca del producto ${nombreProducto}? quiero saber qué marcas disponibles hay`,
        `Buenas, vengo a consultar sobre ${nombreProducto} me darían sus características y el precio?`
    ];
    return consultas[Math.floor(Math.random() * consultas.length)];
}
}



class producto {
    constructor(codigo, nombre, precio, categoria, stock) {
        this._codigo = codigo;
        this._nombre = nombre;
        this._precio = precio;
        this._categoria = categoria;
        this._stock = stock;
    }

    get codigo() {
        return this._codigo;
    }

    set codigo(nuevoCodigo) {
        this._codigo = nuevoCodigo;
    }

    get nombre() {
        return this._nombre;
    }

    set nombre(nuevoNombre) {
        this._nombre = nuevoNombre;
    }

    get precio() {
        return this._precio;
    }

    set precio(nuevoPrecio) {
        if (nuevoPrecio >= 0) {
            this._precio = nuevoPrecio;
        }
    }

    get categoria() {
        return this._categoria;
    }

    set categoria(nuevaCategoria) {
        this._categoria = nuevaCategoria;
    }

    get stock() {
        return this._stock;
    }

    set stock(nuevoStock) {
        if (nuevoStock >= 0) {
            this._stock = nuevoStock;
        }
    }

    getInfo() {
        return `${this._nombre} (${this._codigo}) - $${this._precio} - Stock: ${this._stock}`;
    }
}
class OrdenDeCompra {
    constructor(cliente, vendedor) {
        this._cliente = cliente;
        this._vendedor = vendedor;
        this._fecha = new Date().toLocaleDateString();
        this._items = []; 
    }

    get cliente() {
        return this._cliente;
    }

    set cliente(nuevoCliente) {
        this._cliente = nuevoCliente;
    }

    get vendedor() {
        return this._vendedor;
    }

    set vendedor(nuevoVendedor) {
        this._vendedor = nuevoVendedor;
    }

    get fecha() {
        return this._fecha;
    }

    get items() {
        return this._items;
    }

    // Método para agregar productos 
    agregarItem(producto, cantidad) {
        
        const itemExistente = this._items.find(item => item.producto.codigo === producto.codigo);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this._items.push({
                producto: producto,
                cantidad: cantidad,
                precioUnitario: producto.precio
            });
        }
        
        producto.stock -= cantidad;
        
        return `Item agregado: ${cantidad} x ${producto.nombre}`;
    }

    // Método obtenerTotal
    obtenerTotal() {
        return this._items.reduce((total, item) => {
            return total + (item.precioUnitario * item.cantidad);
        }, 0);
    }

    // Método full detalle
    detalleCompleto() {
        let detalle = `Orden de compra \n`;
        detalle += `Fecha: ${this._fecha}\n`;
        detalle += `Cliente: ${this._cliente.nombre} (${this._cliente.numeroCliente})\n`;
        detalle += `Vendedor: ${this._vendedor.nombre} - ${this._vendedor.sector}\n`;
        detalle += `----------------------------------------\n`;
        detalle += `ITEMS:\n`;
        
        this._items.forEach((item, index) => {
            detalle += `${index + 1}. ${item.producto.nombre}\n`;
            detalle += `   Cantidad: ${item.cantidad} x $${item.precioUnitario} = $${item.precioUnitario * item.cantidad}\n`;
        });
        detalle += `TOTAL: $${this.obtenerTotal()}\n`;
        return detalle;
    }

    // Método adicional útil
    obtenerCantidadItems() {
        return this._items.reduce((total, item) => total + item.cantidad, 0);
    }
}

// Pruebas // 
const vendedor1 = new vendedor("Mariano Martinez", "14562025", 30, "856_ven", "pintura");
const tecnico1 = new tecnico("Carlos Coria", "62565897", 45, "Electricidad", "tarde");
const cliente1 = new cliente("Marilyn Monroe", "40658961", 28, "025_client", "particular");
const cliente2 = new cliente("Raul Ricardo", "25684894", 26, "026_client", "empresa")
//venta #1
console.log("1. " + vendedor1.realizarVenta(cliente1, "Taladro Profesional"));
//Venta #2
console.log("1." + vendedor1.realizarVenta(cliente2, "Pintura al agua"));

//asesoramiento cliente  
console.log("2. " + tecnico1.asesorarCliente(cliente1, "Generador", "No enciende"));

//consulta cliente sobre producto 
console.log("3. " + cliente2.consultaProducto("Soldadora"));

//consulta del cliente
console.log("4. " + cliente1.consultaCliente(tecnico1, "Compresor", "Fuga de aire"));


// productos--z
const taladro = new producto("0001", "Taladro ", 45000, "Herramientas Eléctricas", 10);
const amoladora = new producto("0002", "Amoladora", 32000, "Herramientas Eléctricas", 8);
const soldadora = new producto("0003", "Soldadora ", 89000, "Soldadura", 5);

// otros 
const vendedor2 = new vendedor("Lito Lizarte", "41256023", 27, "857_vend", "Herramientas");
const cliente3 = new cliente("Ramiro Rodriguez", "25698745", 45, "027", "Empresa");

// OC 
const orden1 = new OrdenDeCompra(cliente1, vendedor1);

// Agregar productos a la orden 
console.log(orden1.agregarItem(taladro, 2));
console.log(orden1.agregarItem(amoladora, 1));
console.log(orden1.agregarItem(soldadora, 1));

// Mostrar detalle completo
console.log(orden1.detalleCompleto());

// También puedes obtener solo el total
console.log(`Total de la orden: $${orden1.obtenerTotal()}`);