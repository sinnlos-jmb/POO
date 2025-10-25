class Persona {
    #nombre;
    #dni;
    #edad;

    constructor(nombre, dni, edad) {
        this.#nombre = nombre;
        this.#dni = dni;
        this.#edad = edad;
    }
    getNombre() {
        return this.#nombre;
    }
    setNombre(nuevoNombre) {
        if (typeof nuevoNombre === 'string' && nuevoNombre.trim() !== '') {
            this.#nombre = nuevoNombre;
        } else {
            console.error('Nombre inválido');
        }
    }
    getDni() {
        return this.#dni;
    }
    setDni(nuevoDni) {
        if (Number.isInteger(nuevoDni) && nuevoDni > 0) {
            this.#dni = nuevoDni;
        } else {
            console.error('DNI inválido');
        }
    }
    getEdad() {
        return this.#edad;
    }
    setEdad(nuevaEdad) {
        if (Number.isInteger(nuevaEdad) && nuevaEdad >= 0) {
            this.#edad = nuevaEdad;
        } else {
            console.error('Edad inválida');
        }
    }
    infoPersona() {
        console.log(`El nombre de la persona es ${this.getNombre()}, el DNI es ${this.getDni()}, y la edad es ${this.getEdad()}`);
    }
}

class Cliente extends Persona {
    static listaClientes = [];

    constructor(nombre, dni, edad, codigocliente, categoria) {
        super(nombre, dni, edad);
        this._codigocliente = codigocliente;
        this.categoria = categoria;
        Cliente.listaClientes.push({ nombre: this.getNombre(), codigo: this.getCodigoCliente() });
    }
    getCodigoCliente() {
        return this._codigocliente;
    }
    static getListaClientes() {
        return Cliente.listaClientes.map(c => `${c.nombre} (Cód: ${c.codigo})`).join(', ');
    }
    infoCliente() {
        console.log(`Nombre: ${this.getNombre()}, DNI: ${this.getDni()}, Edad: ${this.getEdad()}, Código: ${this.getCodigoCliente()}, Categoría: ${this.categoria}`);
    }
    consultarProducto(cliente, vendedor, nombreProducto) {
        console.log(`el cliente ${cliente.getNombre()}, consulta con el vendedor ${vendedor.getNombre()}, acerca del producto ${nombreProducto}`);
    }
}

class Vendedor extends Persona {
    static listaVendedores = [];

    constructor(nombre, dni, edad, codigoempleado, sector) {
        super(nombre, dni, edad);
        this._codigoempleado = codigoempleado;
        this.sector = sector;
        Vendedor.listaVendedores.push({ nombre: this.getNombre(), codigo: this.getCodigoEmpleado(), sector: this.sector });
    }
    getCodigoEmpleado() {
        return this._codigoempleado;
    }
    static getListaVendedores() {
        return Vendedor.listaVendedores.map(v => `${v.nombre} (Cód: ${v.codigo}, Sector: ${v.sector})`).join(', ');
    }
    infoVendedor() {
        console.log(`Nombre: ${this.getNombre()}, DNI: ${this.getDni()}, Edad: ${this.getEdad()}, Código: ${this.getCodigoEmpleado()}, Sector: ${this.sector}`);
    }
    realizarVenta(cliente, producto, cantidad) {
        console.log(`El vendedor ${this.getNombre()} (Sector: ${this.sector}) realizó una venta a ${cliente.getNombre()}. Producto: ${producto}, Cantidad: ${cantidad}.`);
    }
}

class Tecnico extends Persona {
    static listaTecnicos = [];

    constructor(nombre, dni, edad, especialidad, turno) {
        super(nombre, dni, edad);
        this._especialidad = especialidad;
        this.turno = turno;
        Tecnico.listaTecnicos.push({ nombre: this.getNombre(), especialidad: this.getEspecialidad(), turno: this.turno });
    }
    getEspecialidad() {
        return this._especialidad;
    }
    static getListaTecnicos() {
        return Tecnico.listaTecnicos.map(t => `${t.nombre} (Esp: ${t.especialidad}, Turno: ${t.turno})`).join(', ');
    }
    infoTecnico() {
        console.log(`Nombre: ${this.getNombre()}, DNI: ${this.getDni()}, Edad: ${this.getEdad()}, Especialidad: ${this.getEspecialidad()}, Turno: ${this.turno}`);
    }
    asesorarCliente(cliente, producto) {
        console.log(`el tecnico ${this.getNombre()}, asesora al cliente ${cliente.getNombre()} con el producto ${producto.nombre}`);
    }
}

class OrdenCompra {
    static listaOrdenes = [];

    constructor(cliente, fecha, producto, cantidad, precioUnitario) {
        this._cliente = cliente;
        this._fecha = fecha;
        this._producto = producto;
        this._cantidad = cantidad;
        this._precioUnitario = precioUnitario;
        OrdenCompra.listaOrdenes.push(this);
    }
    getTotalItem() {
        return this._cantidad * this._precioUnitario;
    }
    getCliente() {
        return this._cliente;
    }
    getFecha() {
        return this._fecha;
    }
    getProducto() {
        return this._producto;
    }
    getCantidad() {
        return this._cantidad;
    }
    getPrecioUnitario() {
        return this._precioUnitario;
    }
    static getListaItems() {
        return OrdenCompra.listaOrdenes.map(
            orden => `${orden.getProducto()} x${orden.getCantidad()} ($${orden.getTotalItem().toFixed(2)} total, Cliente: ${orden.getCliente().getNombre()})`
        ).join(' | ');
    }
    agregarItem(producto, cantidad, precioUnitario) {
        console.warn("Este método solo funciona si se crea una nueva OrdenCompra, la clase está diseñada para un item por orden.");
        return new OrdenCompra(this.getCliente(), this.getFecha(), producto, cantidad, precioUnitario);
    }
}

class Ferreteria {
    static pintura = [];
    static plomeria = [];

    constructor(nombre) {
        this._nombre = nombre;
    }
    getNombre() {
        return this._nombre;
    }
    infoFerreteria() {
        console.log(`El nombre de la ferreteria es ${this.getNombre()}.`);
        console.log(`Vendedores: ${Vendedor.getListaVendedores()}`);
        console.log(`Técnicos: ${Tecnico.getListaTecnicos()}`);
        console.log(`Clientes: ${Cliente.getListaClientes()}`);
        console.log(`Órdenes de Compra: ${OrdenCompra.getListaItems()}`);
    }
    static getListaVendedoresPorSector(vendedor) {
        if (vendedor.sector === 'pintura') {
            Ferreteria.pintura.push(vendedor.getNombre());
        }
        else {
            Ferreteria.plomeria.push(vendedor.getNombre());
        }
    }
    static listarVendedoresSector() {
        if (!Array.isArray(this.pintura) || !Array.isArray(this.plomeria)) {
            console.error('datos invalidos');
            }
        else {
            console.log(`vendedores sector pintura: ${Ferreteria.pintura.join(', ')}`);
            console.log(`vendedores sector plomeria: ${Ferreteria.plomeria.join(', ')}`);
            }
    }
}
const mario = new Persona('Mario', 49320431, 14);
const juliana = new Persona('Juliana', 48384391, 17);
mario.infoPersona();
juliana.infoPersona();

const ferreteria1 = new Ferreteria('ferreteria pro');

const cliente1 = new Cliente('juan', 38219483, 31, 38193, 'empresa');
const cliente2 = new Cliente('pablo', 31214583, 46, 28133, 'empresa');
const vendedor1 = new Vendedor('marcos', 32911940, 44, 1123, 'pintura');
const vendedor2 = new Vendedor('jose', 42149234, 24, 2193, 'plomeria');
const tecnico1 = new Tecnico('xavier', 21384923, 64, 'electricidad', 'tarde');
const tecnico2 = new Tecnico('martina', 34999921, 39, 'carpinteria', 'noche');

const orden1 = new OrdenCompra(cliente1, '2025-10-15', 'Tornillos', 500, 40);
const orden2 = new OrdenCompra(cliente2, '2025-10-15', 'Martillo', 200, 4500);

console.log(`informacion de los clientes`);
cliente1.infoCliente();
cliente2.infoCliente();
vendedor1.infoVendedor();
vendedor2.infoVendedor();
tecnico1.infoTecnico();
tecnico2.infoTecnico();

vendedor1.realizarVenta(cliente1, 'Tornillos', 50);
tecnico2.asesorarCliente(cliente2, {nombre:'Martillo'});
cliente1.consultarProducto(cliente1, vendedor1, 'Tornillos');

Ferreteria.getListaVendedoresPorSector(vendedor1);
Ferreteria.getListaVendedoresPorSector(vendedor2);

ferreteria1.infoFerreteria();
Ferreteria.listarVendedoresSector();