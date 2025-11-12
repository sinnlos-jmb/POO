class persona
{
     //atributos:
    constructor (nombre, dni, edad)
    {
      this._nombre = nombre;
        this._dni = dni;
        this._edad = edad;
    }
    

   get nombre() {
        return this._nombre;
    }
    get dni() {
        return this._dni;
    }
    get edad() {
        return this._edad;
    }
    set nombre (nuevoNombre)
    {
        this._nombre = nuevoNombre;
    }
    set dni (nuevoDni)
    {
        this._dni = nuevoDni;
    }

    set edad (nuevoEdad)
    {
       this._edad = nuevoEdad;
    }
    
 }



class vendedor extends persona{

    //atributos:
    constructor (nombre,dni,edad,codigoEmpleado, sector){
    super(nombre,dni,edad);
    this.codigoEmpleado= codigoEmpleado;
    this.sector = sector;
    }
    
//Metodos
     realizarVenta(cliente, producto)
    {
        console.log(`Venta realizada por ${this.nombre} (${this.codigoEmpleado}):`);
        console.log(`  - Cliente: ${cliente.nombre}`);
        console.log(`  - Producto: ${producto}`);
    }
}

class tecnico extends persona
{
    constructor (nombre,dni,edad, especialidad,turno){
        super(nombre,dni,edad);
        this.especialidad = especialidad;
        this.turno = turno;
    }
    //Metodos
    asesorarCliente(cliente, producto)
    {
         console.log(`Asesoramiento técnico de ${this.nombre} (${this.especialidad}):`);
        console.log(`  - Cliente: ${cliente.nombre}`);
        console.log(`  - Recomendación para ${producto}: Revisar aspectos técnicos y de seguridad.`);
    }
}



class cliente extends persona
{
     //atributos:
    constructor (nombre, dni, edad, numeroCliente, categoria){
        super(nombre,dni,edad);
        this.numeroCliente=numeroCliente;
        this.categoria= categoria;
    }

    //Metodos
    consultarProducto(nombreProducto)
    {
       return `Cliente ${this.nombre} (Nº ${this.numeroCliente}) consulta sobre el producto: ${nombreProducto}. ¿Está disponible y cuál es el precio?`;
    }
}

// PARTE 2
class OrdenDeCompra
{
 //atributos:
constructor (cliente, vendedor)
{
this.cliente=cliente;
this.vendedor=vendedor;
this.fecha= new Date().toLocaleDateString();
this.items = [];

}

//Metodos
agregarItem(producto, cantidad, precioUnitario)
{
    const item = {
        producto: producto,
        cantidad: cantidad,
        precioUnitario: precioUnitario
    };
    this.items.push(item);
}

obtenerTotal()
{
    return this.items.reduce((total, item) => {
        return total + (item.cantidad * item.precioUnitario);
    }, 0);
}
detalleCompleto()
{
    console.log('\n---- Orden de Compra ----');
    console.log(`Cliente: ${this.cliente.nombre}`);
    console.log(`Vendedor: ${this.vendedor.nombre}`);
    console.log(`Fecha: ${this.fecha}`);
    
    console.log(`---- Detalle de Items ----`);

    this.items.forEach(item => {
        const subtotal = item.cantidad * item.precioUnitario;
        console.log(`- ${item.producto}: ${item.cantidad} uni. @ $${item.precioUnitario.toFixed(2)} = $${subtotal.toFixed(2)}`);
    });

    console.log (`Total: $${this.obtenerTotal().toFixed(2)}`);
}
}


// PARTE 3
class Ferreteria
{
     //atributos:
    constructor(nombre)
    {
        this.nombre = nombre;
        this.vendedores= [];
        this.tecnicos = [];
        this.clientes = [];
        this.ordenes = [];

    }

    //Metodos
    registrarPersonal(persona)
    {
        if (persona  instanceof vendedor){
            this.vendedores.push(persona);
            console.log(`Vendedor ${persona.nombre} registrado.`); 
        } else if (persona instanceof tecnico) 
        {
            this.tecnicos.push(persona);
            console.log (`Técnico ${persona.nombre} registrado.`);
        }else
        {
            console.warn(`La persona ${persona.nombre} no es un Vendedor ni Técnico por lo que debe ser un Cliente`);
        }

    }
    registrarCliente(cliente)
    {
        if (cliente instanceof cliente)
        {
            this.clientes.push(instanciaClientecliente); 
            console.log(`Cliente ${cliente.nombre} registrado.`);
        } else{
            console.log (` El objeto que se cargo no pertenece a una instancia Cliente.`);
        }
    }
    }
    crearOrden(cliente, vendedor)
    {
        if (!this.clientes.includes(cliente) || !this.vendedores.includes(vendedor)){
            console.log (`Error: No se encuentra Cliente o Vendedor en el sistema`);
            return null;
        }
        const nuevaOrden = new OrdenDeCompra(cliente, vendedor);
        this.ordenes.push(nuevaOrden);
        console.log(`Orden de compra creada (Cliente: ${cliente.nombre}, Vendedor: ${vendedor.nombre}).`);
        return nuevaOrden;
    }

    agregarItemOrden(orden, producto, cantidad, precioUnitario)
    {
        if (orden instanceof OrdenDeCompra)
        {
            orden.agregarItem(producto, cantidad, precioUnitario);

        }else
        {
            console.log("Error: El elemento que se indica no es una orden de compra válida. ");
        }

    }

    mostrarOrden(orden)
    {
        if (orden instanceof OrdenDeCompra)
        {
            orden.detalleCompleto();
        }else{
            console.log("Error: El elemento indicado no es una Orden de compra. ");
        }

    }

    listarVendedoresPorSector(sector)
    {
        console.log(`------ Vendedores en el sector:  "${sector}" ----`);
       
        const filtrados = this.vendedores.filter(v =>
            v.sector && v.sector.toLowerCase() === sector.toLowerCase());

        if (filtrados.length === 0 )
        {
            console.log(`No se encuentran vendedores en el sector ${sector}.`);
        }

        filtrados.forEach(v => {
            console.log(`- ${v.nombre} (Código: ${v.codigoEmpleado})`);
        });
        return filtrados;
    }



// PRUEBA

const ferre = new Ferreteria("Ferretería Central");
const v1 = new vendedor("Carlos", "123", 30, "V001", "pintura");
const t1 = new tecnico("Laura","456", 28, "electricidad", "mañana");
const c1 = new cliente("Mario", "789", 45, "C100", "particular");

ferre.registrarPersonal(v1);
ferre.registrarPersonal(t1);
ferre.registrarCliente(c1);