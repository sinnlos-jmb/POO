class Persona{
    constructor(nombre,dni,edad){
        this.nombre=nombre;
        this.dni=dni;
        this.edad=edad;
    }

    GetInfoPersona(){
        return `nombre:${this.nombre} , edad:${this.edad} dni ${this.dni}`;
    }

}

class Producto{
    constructor(nombre, precio, categoria){
        this.nombre=nombre;
        this.precio=precio;
        this.categoria=categoria;
    }

    GetinfoProducto(){
        return `Producto: ${this.nombre}, precio: ${this.precio} categoria: ${this.categoria}.`;
    }

}

class Tecnico extends Persona{
    constructor(nombre, dni, edad, especialidad, turno){
        super(nombre, dni, edad);
        this.especialidad=especialidad;
        this.turno=turno;
    }

    asesorarCliente(cliente,producto){//recomendacion tecnica
        console.log(`${cliente.GetinfoCliente()}, le recomiendo comprar ${producto.GetinfoProducto()}.`);

    }
}

class Cliente extends Persona{
    constructor(nombre, dni,edad,numeroCliente){
        super(nombre,dni,edad);
        this.numeroCliente=numeroCliente;
    }

        GetinfoCliente(){
        return `Cliente: ${this.GetInfoPersona()}, ${this.numeroCliente}.`;
    }

    consultarProducto(producto){
        console.log( `El ${producto.GetinfoProducto()} esta disponible para la compra`);
    }
}

class Vendedor extends Persona{
    constructor(nombre, dni, edad, codigoEmpleado, sector){
        super(nombre, dni,edad);
        this.codigoEmpleado=codigoEmpleado;
        this.sector=sector;//(herramientas, pintura, plomería, etc.)
    }

    getinfoVendedor(){
        return `Vendedor: ${this.GetInfoPersona()}, codigoEmpleado: ${this.codigoEmpleado}, sector: ${this.sector}.`;
    }

    realizarVenta(cliente,producto){
        console.log( `El ${cliente.GetinfoCliente()} compro ${producto.GetinfoProducto()}. Venta hecha por: ${vendedor1.getinfoVendedor()}`);
    }
}

class OrdenDeCompra{
    constructor(cliente,fecha,vendedor){
        this.cliente=cliente;
        this.fecha=fecha;
        this.vendedor=vendedor;
        this.items=[];
    }

    agregarItems(item){
        this.items.push(item);
    }

  obtenerTotal() {
    let total = 0;
    for (let i of this.items) {
      total += i.cantidad * i.precioUnitario;
    }
    return total;
  }

    detalleCompleto(){
        let detalleCompra=
         `Detalle orden de compra: ${this.cliente.GetinfoCliente()}, fecha: ${this.fecha}, ${this.vendedor.getinfoVendedor()}, \n compro:\n ${this.items}.`;
         this.items.forEach(i => {
      detalleCompra += `- ${i.producto.nombre} x${i.cantidad} = $${i.cantidad * i.precioUnitario}\n`;
    });
    detalleCompra += `\nTOTAL: $${this.obtenerTotal()}`;
    return detalleCompra;
    }
}

let cliente1= new Cliente("lucia", 40807808, 28, 125);
let producto1= new Producto("taladro",500000, "hogar");
let vendedor1= new Vendedor("Christian" , 38259559, 32, 101,"ventas");
let tecnico1= new Tecnico("pedro", 45789456, 25, "tecnico", "tarde");
cliente1.consultarProducto(producto1);
tecnico1.asesorarCliente(cliente1,producto1);//me faltaria en el metodo mostrar datos del tecnico
vendedor1.realizarVenta(cliente1,producto1);

let producto2 = new Producto("destornillador", 2500, "herramientas");

let orden1 = new OrdenDeCompra(cliente1, "15/10/2025", vendedor1);


orden1.agregarItems({ producto: producto1, cantidad: 2, precioUnitario: producto1.precio });
orden1.agregarItems({ producto: producto2, cantidad: 1, precioUnitario: producto2.precio });


console.log(orden1.detalleCompleto());