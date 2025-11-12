class Persona{
    #nombre;
    #dni;
    #edad;

    constructor(nombre, dni, edad) {
    this.#nombre = nombre;
    this.#dni = dni;
    this.#edad = edad;
    }
    
    setNombre(nombre){
        this.#nombre = nombre;
    }

    setDni(dni){
        this.#dni = dni;
    } 

    setEdad(edad){
        this.#edad = edad;
    }

    getNombre(){
        return this.#nombre;
    }

    getDni(){
        return this.#dni;
    }

    getEdad(){
        return this.#edad;
    }
}

class Cliente extends Persona{
    constructor(nombre,dni,edad,numeroCliente, categoria){
        super(nombre,dni,edad);
        this.numeroCliente = numeroCliente;
        this.categoria = categoria;
    }

    consultarProducto(nombreProducto){
        return console.log(`El cliente ${this.nombre} ha consultado el precio del producto ${nombreProducto}`);
    }
}

class Vendedor extends Persona{
    constructor(nombre,dni,edad,codigoEmpleado,sector){
        super(nombre,dni,edad);
        this.codigoEmpleado = codigoEmpleado;
        this.sector = sector;
    }

    realizarVenta(cliente,producto){
        return console.log `Cliente atendido por: ${this.nombre} del sector ${this.sector}
        Cliente: ${cliente.nombre}, Numero de cliente: ${cliente.numeroCliente}`;
                
    }
}

class Tecnico extends Persona {
    constructor(nombre,dni,edad,especialidad,turno){
        super(nombre,dni,edad);
        this.especialidad = especialidad;
        this.turno = turno;
    }

    asesorarCliente(cliente,producto){

    }
}

class OrdenDeCompra{
    constructor(cliente,fecha,vendedor){
        this.cliente = cliente;
        this.fecha = fecha;
        this.vendedor = vendedor;
        this.items = [];
    }

    agregarItems(item){
        this.items.push(item);
    }

    obtenerTotal(){
        let total = 0;
        for(let i = 0; i < this.items.length; i++){
            const item = this.items[i];
            total += item.cantidad * item.precioUnitario;
        }
        return total;
    }

    detalleCompleto(){
        return console.log(`Productos seleccionados: ${this.items}`);
    }
}

class Ferreteria{
    constructor(nombre){
        this.nombre = nombre;
        this.vendedores = [];
        this.tecnicos = [];
        this.clientes = [];
        this.ordenes = [];
    }

    registrarPersonal(tecnicos,vendedores){
        this.tecnicos.push(tecnicos);
        this.vendedores.push(vendedores);
    }

    totalPersonal(){
        return (this.tecnicos.length + this.vendedores.length);
    }

    registrarCliente(cliente){
        this.clientes.push(cliente);
    }
    getInfo() {
        console.log(this.nombre+"\nclientes: "+JSON.stringify(this.clientes)+", vendedores: "+JSON.stringify(this.vendedores)+", tecnicos: "+JSON.stringify(this.tecnicos));
    }
}

const localUno = new Ferreteria('Ferreteria Gonzalez');
const vendedorUno = new Vendedor('Gonzalo', 36701865, 25, 1432, 'Pintura');
const tecnicoUno = new Tecnico('Ricardo', 45674654, 55, 'Carpinteria', 'Mañana');
const clienteUno = new Cliente('Mario', 45345546, 35, 12, 'Cliente frecuente');
//localUno.registrarPersonal(vendedorUno);
localUno.registrarPersonal(tecnicoUno, vendedorUno);
localUno.registrarCliente(clienteUno);
localUno.getInfo();