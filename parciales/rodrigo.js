class Persona {
    #nombre;
    #dni;
    #edad;

     constructor (pNombre, pDni, pEdad){
        this.#nombre = pNombre;
        this.#dni = pDni;
        this.#edad= pEdad;
     }

    getPersonaNombre() {
        return this.#nombre;
    }
    getPersonaDNI() {
        return this.#dni;
    }
    getPersonaEdad() {
        return this.#edad;
    }

    setPersonaNombre(pNombre) {
        this.#nombre = pNombre;
        console.log(`Nombre modificado correctamente`)
    }
    setPersonaDNI(pDNI) {
        this.#dni = pDNI;
        console.log(`DNI modificado correctamente`)
    }
    setPersonaEdad(pEdad) {
        this.#edad = pEdad;
        console.log(`Edad modificada correctamente`)
    }
}

class Vendedor extends Persona {
    constructor(pNombre, pDNI, pEdad, pCodigoEmpleado, pSector) {
        super(pNombre, pDNI, pEdad);
        this.codigoEmpleado = pCodigoEmpleado;
        this.sector = pSector;
    }

    realizarVenta(cliente, producto) {
        console.log(`El cliente ${cliente.getPersonaNombre()} adquiere el producto con el código ${producto.codigo} que tiene un precio de ${producto.precio}`);
    }
}

class Tecnico extends Persona {
    constructor(pNombre, pDNI, pEdad, pEspecialidad, pTurno) {
        super(pNombre, pDNI, pEdad);
        this.especialidad = pEspecialidad;
        this.turno = pTurno;
    }

    asesorarCliente(cliente, producto) {
        console.log(`Al cliente ${cliente.getPersonaNombre()} con el producto con código ${producto.codigo} se le da la recomendación de extremo cuidado ya que es muy frágil el mismo`);
    }
}

class Cliente extends Persona {
    constructor(pNombre, pDNI, pEdad, pNumeroCliente, pCategoria) {
        super(pNombre, pDNI, pEdad);
        this.numeroCliente = pNumeroCliente;
        this.categoria = pCategoria;
    }

    consultarProducto(pNombreProducto) {
        console.log(`El producto con el código ${pNombreProducto.codigo} está en existencia y cuesta $5000`)
    }
}

/* PARTE 2 */

class Producto {
    constructor(pCodigo, pDescripcion, pPrecio, pCantidad) {
        this.codigo = pCodigo;
        this.descripcion = pDescripcion;
        this.precio = pPrecio;
        this.cantidad = pCantidad;
    }
}

class OrdenDeCompra {
    constructor(pCliente, pFecha, pVendedor) {
        this.cliente = pCliente;
        this.fecha = pFecha;
        this.items = [];
        this.vendedor = pVendedor;
    }

    agregarItem(pItem) {
        this.items.push(pItem);
        console.log(`El item con el código ${pItem.codigo} se agregó correctamente`);
    }
    obtenerTotal() {
        let total = 0;
        this.items.forEach(objeto => {
            total += (objeto.precio * objeto.cantidad);
        })
        console.log(`El monto total es ${total}`);
    }
}

/* PARTE 3 */

class Ferreteria {
    constructor(pNombre) {
        this.nombre = pNombre;
        this.vendedores = [];
        this.tecnicos = [];
        this.clientes = [];
        this.ordenes = [];
    }

    registrarPersonal(pPersona) {
        if (`codigoEmpleado` in pPersona) {
            this.vendedores.push(pPersona);
            console.log(`El vendedor ${pPersona.getPersonaNombre()} ha sido agregado`);
        } else if (`especialidad` in pPersona) {
            this.tecnicos.push(pPersona);
            console.log(`El técnico ${pPersona.getPersonaNombre()} ha sido agregado`);
        }

    }
    registrarCliente(pCliente) {
        this.clientes.push(pCliente);
        console.log(`El cliente ${pCliente.getPersonaNombre()} ha sido agregado`);
    }
    crearOrden(cliente, vendedor) {
        let numeroOrdenAleatorio = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;

        this.ordenes.push({ numeroOrdenAleatorio, cliente, vendedor });

        console.log(`La orden n° ${numeroOrdenAleatorio} del cliente ${cliente.getPersonaNombre()} con el vendedor ${vendedor.getPersonaNombre()} se creó correctamente`);
    }
}

const ferre = new Ferreteria("Ferretería Central");
const v1 = new Vendedor("Carlos", "123", 30, "V001", "pintura");
const t1 = new Tecnico("Laura", "456", 28, "electricidad", "mañana");
const c1 = new Cliente ("Mario", "789", 45, "C100", "particular");
const prd1=new Producto ("Pinza", "10.000", "1000", "200");

ferre.registrarPersonal(v1);
ferre.registrarPersonal(t1);
ferre.registrarCliente(c1);
t1.asesorarCliente(c1,prd1);