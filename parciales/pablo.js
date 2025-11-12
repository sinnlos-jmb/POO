class Persona{#nombre;#dni;#edad;
  constructor(nombre, dni, edad){
    this.#nombre = nombre;
    this.#dni = dni;
    this.#edad = edad;
  }
    getNombre(){return this.#nombre;}
    getDni(){return this.#dni;}
    getEdad(){return this.#edad;}
    setNombre(nombre){this.#nombre = nombre;}
    setDni(nombre){this.#dni = nombre;}
    setEdad(nombre){this.#edad = nombre;}
}

class Vendedor extends Persona{
  constructor(nombre, dni, edad,codigoEmpleado, sector){
    super(nombre, dni, edad)
    this.codigoEmpleado = codigoEmpleado;
    this.sector = sector;
  }
  realizarVenta(cliente, producto){
    console.log(`${cliente} compro ${producto}`)
  }
}
class Tecnico extends Persona{

  constructor(nombre, dni, edad,especialidad, turno){
    super(nombre, dni, edad)
    this.especialidad = especialidad;
    this.turno = turno;
  }
  asesorarCliente(cliente, producto){}
}
class Cliente extends Persona{

  constructor(nombre, dni, edad,nroCliente, categoria){
    super(nombre, dni, edad);
    this.nroCliente = nroCliente;
    this.categoria = categoria;
  }
  consultarProducto(nombreProducto){
    return (`el ${nombreProducto} cuesta $5000`);
  }
}




class Producto{
  constructor(nombre, precioUnitario){
    this.nombre=nombre;
    this.precioUnitario=precioUnitario;

  }
}

class OrdenDeCompra{
  constructor(nroHC,cliente, fecha, producto, vendedor){
    //super(Cliente.getNombre(), producto.nombre, producto.precioUnitario, vendedor.nombre)
    this.nroHc = nroHC;
    this.fecha = fecha;
    this.items = []
  }
  agregarItem(){
    //this.items.push({${this.nombre}, });}
}
}

let vendedor1 = new Vendedor("Jorge", 2222, 3333, 4444, "herram");
let tecnico1 = new Tecnico("Jorge", 2222, 3333, "carp", "maniana")
let cliente1 = new Cliente("Jorge", 2222, 3333, 4444, "particular")

let producto1 = {
  "nombre": "tornillo"
}

vendedor1.realizarVenta(cliente1.getNombre(), producto1.nombre);