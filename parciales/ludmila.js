


class Persona {
   #edad;
    #dni;
    //setters
    constructor(nombre, dni, edad){
      this.nombre = nombre;
      this.#edad = edad;
      this.#dni = dni;
      
    } 
    //getters
    getPersonaNombre(){
        return this.nombre;
    }
    getPersonaDni(){
        return this.#dni;
    }
    getPersonaEdad(){
        return this.#edad;
    }
} 

class Vendedor extends Persona {
    constructor(nombre, dni, edad, codigoEmpleado, sector) {
        super(nombre, dni, edad);
        this.codigoEmpleado = codigoEmpleado
        this.sector = sector 
    }  
    getSector(herramientas, pintura, plomería){
        return this.sector    
}   
      setRealizarVenta(cliente, producto){
        console.log(`El vendedor ${this.nombre} ha realizado una venta del producto ${producto} al cliente ${cliente}.`);
} 
}
class Tecnico extends Persona {
    constructor(nombre, dni, edad, especialidad, turno) {
        super(nombre, dni, edad);
        this.especialidad = especialidad
        this.turno = turno
        if (turno == "mañana"|| turno == "tarde"|| turno == "noche"){
            this.turno = turno
        } else 
            this.turno = "turno no válido";
    } 

      getEspecialidad(electricidad, carpinteria, soldadura){
            return this.especialidad
        }
        asesorarCliente(cliente, producto){
        return `El técnico ${this.nombre}, especialista en ${this.especialidad}, recomienda el producto ${producto} al cliente ${cliente}.`
    }  }
        
class Cliente extends Persona {
    constructor(nombre, dni, edad, numeroCliente, categoria) {
        super(nombre, dni, edad);
        this.numeroCliente = numeroCliente
        this.categoria = categoria
        if (categoria == "particular"|| categoria == "empresa"){
            this.categoria = categoria
        }   else 
            this.categoria = "categoría no válida"  
    } 
    consutarProducto(nombreProducto){
        return `El cliente ${this.getPersonaNombre()} está consultando por el producto ${nombreProducto}.`
} }


class OrdenDeCompra {
    constructor(cliente, fecha, items= [],vendedor) {
        this.cliente = cliente;
        this.fecha = fecha;
        this.items = items;
        this.vendedor = vendedor;
    }
    agregarItem(item){
        this.items.push(item);
    }
    calcularTotal(){
        return this.items((total, item) => total + item.precio * item.cantidad, 0);
    }
    detalleCompleto(){
        return `Orden de compra para ${this.cliente.nombre} el ${this.fecha} por un total de ${this.calcularTotal()} vendida por ${this.vendedor.nombre}.`
    }
}

class Ferreteria {
    constructor(nombre, vendedores=[], tecnicos=[], clientes = [], ordenes = []) {
        this.nombre = nombre;
        this.vendedores = vendedores;
        this.tecnicos = tecnicos;
        this.clientes = clientes;
        this.ordenes = ordenes;
    }
    registrarPersonal(persona){
}  
    registrarCliente(cliente){
        this.clientes.push(cliente);
  }
    crearOrden(cliente, vendedor){_
        const nuevaOrden = new OrdenDeCompra(cliente, new Date(), [], vendedor);
     this.ordenes.push(nuevaOrden);
     return nuevaOrden;
    }
     agregarItemAOrden(orden, item){
        orden.agregarItem(item);
    }
    mostrarOrden(cliente) {
    }
    listarVendedoresPorSector(sector) {
        return this.vendedores.filter(vendedor => vendedor.sector === sector);
        console.log(`Vendedores en el sector ${sector}:`, this.listarVendedoresPorSector(sector));
    }}

const ferre = new Ferreteria("Ferretería Central");
const v1 = new Vendedor("Ludmila", "123", 30, "V001", "pintura");
const t1 = new Tecnico ("Emanuel", "456", 28, "electricidad", "mañana");
const c1 = new Cliente("Pia", "789", 45, "C100", "particular");

ferre.registrarPersonal(v1);
ferre.registrarPersonal(t1);
ferre.registrarCliente(c1);

console.log(t1.asesorarCliente("Ludmila", "taladro"));
console.log(t1.asesorarCliente("Pia", "cinta métrica"));