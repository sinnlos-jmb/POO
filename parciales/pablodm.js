/* Ejercicio: Sistema de Gestión de Ferretería
Una ferretería industrial necesita administrar su personal (vendedores y técnicos), los clientes, los productos disponibles y las órdenes de compra que incluyen detalles técnicos, precios y responsables.

Objetivo:
Modelar un sistema en JavaScript que simule la gestión de la ferretería.*/


//Parte 1 - Personas de la Ferretería 

class Persona{
    #nombre;
    #dni;
    #edad;
    
    constructor(nombre, dni, edad){
        this.#nombre = nombre;
        this.#dni = dni;
        this.#edad = edad;
    }
    
    get nombre(){
        return this.#nombre;
    }
    
    get dni(){
        return this.#dni;
    }
    
    get edad(){
        return this.#edad;
    }
    
    set nombre(nuevoNombre){
        return this.#nombre = nuevoNombre;
    }
    
    set dni(nuevoDni){
        return this.#dni = nuevoDni;
    }
    
    set edad(nuevaEdad){
        return this.#edad = nuevaEdad;
    }
}

class Vendedor extends Persona{
    constructor(nombre, dni, edad, sector){
        super(nombre, dni, edad);
        this.sector = sector;
    }

    //Método realizarVenta.
    realizarVenta(cliente, producto){
        if(producto.stock > 0){
            producto.stock -= 1;
            console.log(`\n Procesando venta...`);
            console.log(`\n Venta realizada: Vendedor: ${this.nombre}\n - Producto: ${producto.nombre}\n - Importe: $${producto.precio}\n - Cantidad: ${producto.cantidad}\n - Cliente: ${cliente.nombre}.\n - Stock restante: ${producto.stock}`);
        } else {
            console.log(`No hay stock disponible para el producto: ${producto.nombre}`);
        }
    }
}


class Tecnico extends Persona{
    constructor(nombre, dni, edad, especialidad){
        super(nombre, dni, edad);
        this.especialidad = especialidad;
    }
    
    //Método asesorarCliente.
    asesorarCliente(cliente, producto){
        console.log(`\n Asesorando cliente...`);
        console.log(`\n Asesoramiento realizado: Técnico: ${this.nombre}\n - Cliente: ${cliente.nombre}\n - Producto: ${producto.nombre}\n - Especialidad: ${this.especialidad}`);
    }
    
}

class Cliente extends Persona{
    constructor(nombre, dni, edad, categoria){
    super(nombre, dni, edad);
    this.categoria = categoria;
    }
    
    //Método consultarProducto.
    consultarProducto(producto){
        console.log(`\n Consultan de producto...`);
        console.log(`\n Consulta realizada: Cliente: ${this.nombre}`);
        console.log(`\n Producto: ${producto.nombre}\n - Precio: $${producto.precio}\n - Cantidad: ${producto.cantidad}\n - Stock disponible: ${producto.stock}`);
    }
    
}

class Producto{
    constructor(nombre, precio, cantidad, stock){
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.stock = stock;
    }
    
}

const vendedor1 = new Vendedor("Juan Perez", "12345678", 30, "Pinturas");
const vendedor2 = new Vendedor("Luis Martinez", "23456789", 35, "Herramientas");
const tecnico1 = new Tecnico("Carlos Lopez", "34567890", 40, "Electricidad");
const tecnico2 = new Tecnico("Miguel Torres", "45678901", 45, "Plomería");
const tecnico3 = new Tecnico("Jorge Fernandez", "56789012", 38, "Construcción");
const cliente1 = new Cliente("Ana Gómez", "87654321", 28, "Particular");
const cliente2 = new Cliente("Sofia Ramirez", "98765432", 32, "Empresa");
const producto1 = new Producto("Pintura Blanca x 20L", 50, 1, 50);
const producto2 = new Producto("Taladro percutor", 150, 1, 78);
const producto3 = new Producto("Cemento x 50kg", 30, 1, 100);
const producto4 = new Producto("Llave inglesa", 25, 1, 150);

//Metodo arealizarVenta
vendedor1.realizarVenta(cliente1, producto1 );
vendedor2.realizarVenta(cliente2, producto2 );

//Metodo asesorarCliente
tecnico1.asesorarCliente(cliente1, producto2);
tecnico3.asesorarCliente(cliente2, producto1);

//Metodo consultarProducto
cliente1.consultarProducto(producto3);
cliente2.consultarProducto(producto4);

//Parte 2 - Composicion ordenes de compra.

class OrdenDeCompra{
    static contadorOrdenes = 0;//Atributo estático para llevar el conteo de órdenes.
    #idOrden;
    #vendedor;
    #tecnico;
    #cliente;
    #productos = [];//Array de productos.
    
    constructor(vendedor, tecnico, cliente){
        this.#idOrden = ++OrdenDeCompra.contadorOrdenes;
        this.#vendedor = vendedor;
        this.#tecnico = tecnico;
        this.#cliente = cliente;
    }
    
    get idOrden(){
        return this.#idOrden;
    }
    
    get vendedor(){
        return this.#vendedor;
    }
    
    get tecnico(){
        return this.#tecnico;
    }
    
    get cliente(){
        return this.#cliente;
    }
    
    get productos(){
        return this.#productos;
    }
    
    //Método agregarProducto.
    agregarProducto(producto){
        this.#productos.push(producto); //Agrega un producto al array.
        console.log(`\n Agregando producto a la orden...`);
        console.log(`\n Producto agregado: ${producto.nombre}, Cantidad: ${producto.cantidad}, Precio Unitario: $${producto.precio}`);
    }
    
    //Método calcularTotal.
    calcularTotal(){
        let total = 0;
        this.#productos.forEach(producto => {
            total += producto.precio * producto.cantidad; //Suma el precio por la cantidad de cada producto.
        });
        return total; //Retorna el total a pagar.
    }
    
    //Método mostrarOrden.
    mostrarOrden(){
        console.log(`\n Mostrando orden de compra...`);
        console.log(`\n Orden de Compra ID: ${this.#idOrden}`);
        console.log(`\n Vendedor: ${this.#vendedor.nombre}`);
        console.log(`\n Técnico: ${this.#tecnico.nombre}`);
        console.log(`\n Cliente: ${this.#cliente.nombre}`);
        console.log(`\n Productos:`);
        this.#productos.forEach(producto => {
            console.log(`- ${producto.nombre}, Cantidad: ${producto.cantidad}, Precio Unitario: $${producto.precio}, Subtotal: $${producto.precio * producto.cantidad}`);
        });
        console.log(`\n Total a Pagar: $${this.calcularTotal()}`);
        console.log(`\n ---------------------------------------`); //Separador visual.
    }
}

const orden1 = new OrdenDeCompra(vendedor1, tecnico1, cliente1);
orden1.agregarProducto(producto1);
orden1.agregarProducto(producto3);
orden1.mostrarOrden();

const orden2 = new OrdenDeCompra(vendedor2, tecnico3, cliente2);
orden2.agregarProducto(producto2);
orden2.agregarProducto(producto4);
orden2.mostrarOrden();
