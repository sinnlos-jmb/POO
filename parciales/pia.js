class Persona{
        #nombre
        #dni
        #edad
    constructor(p_nombre,p_dni,p_edad){
        this.#nombre= p_nombre;
        this.#dni=p_dni;
        this.#edad=p_edad;
    }
      getNombre() {
        return this.#nombre;
    }
    getDni() {
        return this.#dni;
    }
    getEdad() {
        return this.#edad;
    }

    setNombre(p_nombre){;
        this.#nombre=p_nombre;
    }
    setDni(p_dni){
        this.#dni=p_dni;
    }
    setEdad(p_edad){
        this.#edad=p_edad;
    }
getInfo(){
    return("Nombre: "+ this.#nombre + "- DNI: " + this.#dni + "edad: " + this.getEdad);
   }
}
/*Vendedor
Atributos:
codigoEmpleado
sector (herramientas, pintura, plomería, etc.
Método
realizarVenta(cliente, producto) → imprime mensaje con detalle.*/
class Vendedor extends Persona{
    constructor(p_nombre,p_dni,p_edad,p_codigoEmpleado,p_sector){
    super(p_nombre,p_dni,p_edad);
    this.codigoEmpleado=p_codigoEmpleado;
    this.sector=p_sector;
    }
    realizarVenta(p_cliente, p_producto){
        console.log(`El vendedor ${this.getNombre()} (Sector: ${this.sector}) realizó una venta a ${p_cliente.getNombre()}: ${p_producto.descripcion} por $${p_producto.precio}.`);
    }
}

/*Tecnico
Atributos:
especialidad (electricidad, carpintería, soldadura, etc.)
turno (mañana/tarde/noche)
Método:
asesorarCliente(cliente, producto) → imprime recomendación técnica.*/
class Tecnico extends Persona{
     constructor(p_nombre,p_dni,p_edad,p_especialidad,p_turno){
        super(p_nombre,p_dni,p_edad);
        this.especialidad = p_especialidad;
        this.turno=p_turno;
   }

   asesorarCliente(p_cliente, p_producto) {
     // console.log("La recomendacion tecnica de  " + this.getNombre() + "es la siguiente:" );
      console.log(`El técnico ${this.getNombre()} especialidad: ${this.especialidad}
     asesora al cliente ${p_cliente.getNombre()} sobre el producto: ${p_producto.nombre}.`);
    }

   }


/*Cliente
Atributos:
numeroCliente
categoria (particular, empresa)
Método:
consultarProducto(nombreProducto) → retorna texto simulado de consulta.*/

class Cliente extends Persona{
constructor(p_nombre,p_dni,p_edad,p_nroCliente,p_categoria){
        super(p_nombre,p_dni,p_edad);
        this.numeroCliente = p_nroCliente;
        this.categoria=p_categoria;
       }
       consultarProducto(nombreProducto){
        console.log("El producto consultado tiene este precio");
       }
       infoCliente(){
        console.log(`El cliente: ${this.getNombre()} tiene el nro: ${this.numeroCliente}`);
       }
    }

/*Producto */
class Producto {
    constructor(p_codigo,p_descripcion,p_precio,p_tipo){
        this.codigo=p_codigo;
        this.descripcion=p_descripcion;
        this.precio=p_precio;
        this.tipo=p_tipo;
        this.nombre="prd1";
    }
// getters y setters

   mostrarProducto(){
    return (`Producto  ${this.codigo} - ${this.descripcion}. Precio: ${this.precio} `);
   }
}

/*Clase: OrdenDeCompra
Contiene:
cliente
fecha
items (array de objetos con: producto, cantidad, precioUnitario)
vendedor
Métodos:
agregarItem(item)
obtenerTotal() → suma precios × cantidades
detalleCompleto() → devuelve texto con el resumen de la compra*/
class OrdenDeCompra {
    constructor(pCliente, pFecha, pVendedor) {
        this.cliente = pCliente;
        this.fecha = pFecha;
        this.items = [];
        this.vendedor = pVendedor;
    }
    agregarItem(p_producto) {
        this.items.push(p_producto);
        console.log(`El item con el código ${p_producto.codigo} se agregó correctamente`);
    }
    obtenerTotal() {
        let total = 0;
        this.items.forEach(objeto => {
            total += (objeto.precio * objeto.cantidad);
        })
        console.log(`El monto total es ${total}`);
    }


}

    // DEMOSTRACION
const Tecnico1 = new Tecnico("Laura", "456", 28, "electricidad", "mañana");
const Cliente1 = new Cliente("Mario", "789", 45, "C100", "particular");
Cliente1.infoCliente();
const Prod1 = new Producto("P101","carrete de cable","1000","electricidad");
const Vendedor1 = new Vendedor("Carlos", "123", 30, "V001", "pintura");
Vendedor1.realizarVenta(Cliente1,Prod1);
console.log(Prod1.mostrarProducto());
Tecnico1.asesorarCliente(Cliente1, Prod1);
const OC1 = new OrdenDeCompra(Cliente1,"15/10/2025",Vendedor1)