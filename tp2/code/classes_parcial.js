const lib_c = require("./consts");
const bcrypt = require('bcrypt');  //npm install bcrypt

class Persona {

    constructor (nombre, dni, edad, tipo='C') { //por defecto las personas son clientes (V: vendedor y T: tecnico)
        this._nombre = nombre;
        this._dni = dni;
        this._edad = edad;
        this.tipo_persona=tipo;
        }
    

    get nombre() {
        return this.nombre;
        }
    get dni() {
        return this.dni;
        }
    get edad() {
        return this.edad;
        }
    get tipo() {
        return this.tipo;
        }
    
    
    set tipo(ptipo) {
        this.tipo=ptipo;
        }
    set nombre (nuevoNombre) {
        this.nombre = nuevoNombre;
        }
    set dni (nuevoDni) {
        this.dni = nuevoDni;
        }
    set edad (nuevoEdad) {
       this.edad = nuevoEdad;
        }
    
 }



class Vendedor extends Persona {

    constructor (nombre,dni,edad,codigoEmpleado, sector) {
        super(nombre,dni,edad, 'V');
        this.codigoEmpleado= codigoEmpleado;
        this.sector = sector;
        }
    
//Metodos
     realizarVenta (cliente, producto) {
        console.log(`Venta realizada por ${this.nombre} (${this.codigoEmpleado}):`);
        console.log(`  - Cliente: ${cliente.nombre}`);
        console.log(`  - Producto: ${producto}`);
     }
}

class Tecnico extends Persona {
    constructor (nombre,dni,edad, especialidad,turno){
        super(nombre,dni,edad, 'T');
        this.especialidad = especialidad;
        this.turno = turno;
    }
    //Metodos
    asesorarCliente(cliente, producto) {
         console.log(`Asesoramiento técnico de ${this.nombre} (${this.especialidad}):`);
        console.log(`  - Cliente: ${cliente.nombre}`);
        console.log(`  - Recomendación para ${producto}: Revisar aspectos técnicos y de seguridad.`);
    }
}



class Cliente extends Persona {

    constructor (nombre, dni, edad, numeroCliente, categoria) {
        super(nombre,dni,edad, 'C');
        this.numeroCliente=numeroCliente;
        this.categoria= categoria;
    }

    //Metodos
    consultarProducto(nombreProducto) {
       return `Cliente ${this.nombre} (Nº ${this.numeroCliente}) consulta sobre el producto: ${nombreProducto}. ¿Está disponible y cuál es el precio?`;
    }
}


class OrdenDeCompra {

constructor (cliente, vendedor) {
    this.cliente=cliente;
    this.vendedor=vendedor;
    this.fecha= new Date().toLocaleDateString();
    this.items = [];
    }

agregarItem(producto, cantidad, precioUnitario) {
    const item = {
        producto: producto,
        cantidad: cantidad,
        precioUnitario: precioUnitario
    };
    this.items.push(item);
}

obtenerTotal() {
    return this.items.reduce((total, item) => {
        return total + (item.cantidad * item.precioUnitario);
    }, 0);
}
detalleCompleto() {
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


/*Producto */
class Producto {
    constructor(p_codigo,p_nombre,p_precio,p_stock){
        this.codigo=p_codigo;
        this.nombre=p_nombre;
        this.precio=p_precio;
        this.stock=p_stock;
    }

    getCodigo(){
        return this.codigo;    }
    getNom_producto(){
        return this.nombre;    }
    getPrecio(){
        return this.precio;    }
    getStock(){
        return this.stock;    }

    setCodigo(pcod){
        this.codigo=pcod;    }
    setNombre_producto(pnom){
        this.nombre=pnom;    }
    setStock(stock_i, cantidad){ //stock_i para evitar concurrencia
        this.strock-=cantidad;    }
    setPrecio(pprecio){
        this.precio=pprecio;    }


   mostrarProducto(){
    return (`Producto  ${this.codigo} - ${this.nombre}. Precio: ${this.precio}. Stock: ${this.stock} `);
   }
}




class Ferreteria {

    static dbase= { init:false, tecnicos:[], vendedores:[], clientes:[], ordenes:[], productos:[] };
    constructor(pcod_ferreteria) {
        this.codigo = pcod_ferreteria;
        this.nombre=null;
        this.domicilio=null;
        if (!Ferreteria.dbase.init) {
            Ferreteria.dbase.init=this.init();  }
        }


    async init() {
        console.log("ingreso a init. codigo ferreteria: "+this.codigo);
        let conn = null;
        const queryf="select * from Ferreterias where id_ferreteria="+this.codigo, 
                queryp="select id_persona, concat(nombre_persona, ' ', apellido_persona) as nombre, tipo_persona, dni_persona, DATE_FORMAT(fecha_nacimiento , '%d/%m/%Y') as fecha_nacimiento, cod_vendedor, sector_vendedor, especialidad_tecnico, turno_tecnico, cod_cliente, categoria_cliente  from Personas",
                querypr="select id_producto, nombre_producto, precio_producto, stock from Productos";

        
        try {
            conn = await lib_c.pool.getConnection();
            let rows = await conn.query(queryf);
            for (let i in rows) {
                this.nombre=rows[i].nombre_ferreteria;
                this.domicilio= rows[i].domicilio_ferreteria;
                }
            console.log("obtengo datos de ferreteria: "+this.nombre+", domicilio: "+this.domicilio);

            console.log("incializando personas");
            rows = await conn.query(queryp);

            for (const row of rows) {
                if (row.tipo_persona==='C') {
                    Ferreteria.dbase.clientes.push(new Cliente(row.nombre, row.dni_persona, row.fecha_nacimiento, row.cod_cliente, row.categoria_cliente));
                    }
                else if (row.tipo_persona==='V') {
                    Ferreteria.dbase.vendedores.push(new Vendedor(row.nombre, row.dni_persona, row.fecha_nacimiento, row.cod_vendedor, row.sector_vendedor));
                    }
                else if (row.tipo_persona==='T') {
                    Ferreteria.dbase.tecnicos.push(new Tecnico(row.nombre, row.dni_persona, row.fecha_nacimiento, row.especialidad_tecnico, row.turno_tecnico));
                    }
                }
            console.log("arrays de personas (clientes, tecnicos y vendedores):\n"+this.MostrarDataPersonas());


            console.log("incializando productos");
            rows = await conn.query(querypr);

            for (let i in rows) {
                Ferreteria.dbase.productos.push(new Producto(rows[i].id_producto, rows[i].nombre_producto, rows[i].precio_producto, rows[i].stock));

                }
            console.log("arrays de productos:\n"+this.MostrarDataProductos());

            Ferreteria.dbase.init= true;
            } 
        catch (err) {
            console.log(err);
            Ferreteria.dbase.init= false;
            return false;
            } 
        finally {
            if (conn) await conn.release();
            }
    }

    registrarPersonal(persona) {
        if (persona  instanceof Vendedor){
            this.vendedores.push(persona);
            console.log(`Vendedor ${persona.nombre} registrado.`); 
            }
        else if (persona instanceof Tecnico) {
            this.tecnicos.push(persona);
            console.log (`Técnico ${persona.nombre} registrado.`);
            }
        else {
            console.warn(`La persona ${persona.nombre} no es un Vendedor ni Técnico por lo que debe ser un Cliente`);
            }

    }

    registrarCliente(cliente) {
        if (cliente instanceof cliente) {
            this.clientes.push(instanciaClientecliente); 
            console.log(`Cliente ${cliente.nombre} registrado.`);
            } 
        else {
            console.log (` El objeto que se cargo no pertenece a una instancia Cliente.`);
            }
    }

    crearOrden(cliente, vendedor)  {
        if (!this.clientes.includes(cliente) || !this.vendedores.includes(vendedor)){
            console.log (`Error: No se encuentra Cliente o Vendedor en el sistema`);
            return null;
            }
        const nuevaOrden = new OrdenDeCompra(cliente, vendedor);
        this.ordenes.push(nuevaOrden);
        console.log(`Orden de compra creada (Cliente: ${cliente.nombre}, Vendedor: ${vendedor.nombre}).`);
        return nuevaOrden;
        }

    agregarItemOrden(orden, producto, cantidad, precioUnitario) {
        if (orden instanceof OrdenDeCompra) {
            orden.agregarItem(producto, cantidad, precioUnitario);
            }
        else {
            console.log("Error: El elemento que se indica no es una orden de compra válida. ");
            }

    }

    mostrarOrden(orden) {
        if (orden instanceof OrdenDeCompra)   {
            orden.detalleCompleto();
            }
        else {
            console.log("Error: El elemento indicado no es una Orden de compra. ");
        }

    }

    listarVendedoresPorSector(sector) {
        console.log(`------ Vendedores en el sector:  "${sector}" ----`);
       
        const filtrados = this.vendedores.filter(v =>
            v.sector && v.sector.toLowerCase() === sector.toLowerCase());

        if (filtrados.length === 0 ) {
            console.log(`No se encuentran vendedores en el sector ${sector}.`);
            }

        filtrados.forEach(v => {
            console.log(`- ${v.nombre} (Código: ${v.codigoEmpleado})`);
        });
        return filtrados;
    }

    MostrarData() {
        return `datos de ferreteria: codigo: ${this.codigo}, nombre: ${this.nombre}, domicilio: ${this.domicilio}`; 
        }
    MostrarDataPersonas() {
        return `clientes: ${JSON.stringify(Ferreteria.dbase.clientes)}\nvendedores: ${JSON.stringify(Ferreteria.dbase.vendedores)}\ntecnicos: ${JSON.stringify(Ferreteria.dbase.tecnicos)}`; 
    }
    MostrarDataProductos() {
        return `productos:\n ${JSON.stringify(Ferreteria.dbase.productos)}`; 
    }
        
    }



class Login {
  #pwd="";
  constructor(puser, ppwd) {
    this.user = puser;
    this.#pwd=ppwd;
  }

  async autenticar() {
        console.log("ingreso a autenticar");
        const conn = await lib_c.pool.getConnection();
        const pwd_hash=await bcrypt.hash(this.#pwd, 10);
        console.log("hash de pwd: "+this.#pwd+":"+pwd_hash);


        try {
        const rows = await conn.execute(
            'SELECT nombre_usuario, pwd_usuario FROM usuarios WHERE nombre_usuario = ?',
            [this.user]
        );

        /*
            CREATE TABLE usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre_usuario VARCHAR(255) NOT NULL,
            pwd_usuario VARCHAR(255) NOT NULL -- almacenada con bcrypt
            );
        */

        if (rows.length === 0) {
            console.log("usuario no encontrado");
            return { success: false, message: 'Usuario no encontrado' };
        }

        const user = rows[0].nombre_usuario, pwd=rows[0].pwd_usuario;

        

        const match = await bcrypt.compare(this.#pwd, pwd);
        console.log(match);

        if (match) {
            console.log("usuario encontrado!");
            return { success: true, message: 'Login exitoso', user: user.nombre_usuario };
        } else {
            return { success: false, message: 'Contraseña incorrecta' };
        }
        } catch (error) {
        return { success: false, message: 'Error en autenticación', error };
        } finally {
        await conn.release();
        }
  }

  async nuevo_usuario () {
    let rta = "";
    const pwd_hash=await bcrypt.hash(this.#pwd, 10);
    const conn = await lib_c.pool.getConnection(), query="insert into usuarios  (nombre_usuario, pwd_usuario) "+
                                    "Values ('"+this.user+"', '"+pwd_hash+"')";
    try {
            const r=await conn.query(query);
            rta="OK. affectedRows:"+r.affectedRows.toString()+", insertId:"+r.insertId.toString();
            }
    catch (err) {console.log("error en funcion insert user\n"+err);rta=err;} 
    finally { 
        if (conn)  await conn.release();
        return rta;
        }
    }
}

module.exports = {Producto, Ferreteria, Login }