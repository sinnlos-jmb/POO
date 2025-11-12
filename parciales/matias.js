class Persona{
    constructor(nombre, dni, edad){
        this._nombre = nombre;
        this._dni = dni;
        this._edad = edad;
    }
}

class OrgdenDeCompra{
    constructor(cliente, fecha, vendedor){
        this.cliente = cliente;
        this.fecha = fecha;
        this.items = [];
        this.vendedor = vendedor;
    }

    agregar_item(item){
        this.items.push(item);
    }

    obtener_total(){
        let total = 0;

        for(let i = 0; i < this.items.length; i++){
            total += this.items[i].Cantidad * this.items[i].Precio;
        }

        return total;
    }

    detalle_completo(){
        let todo = [];

        for(let i = 0; i < this.items.length; i++){
            todo.push(this.items[i].Nombre);
        }

        return {Cliente: this.cliente, Objetos: todo, Fecha: this.fecha, Vendedor: this.vendedor};
    } 
}

class Ferreteria{
    static vendedores = [];
    static tecnicos = [];
    static clientes = [];
    static ordenes = [];

    constructor(){
        this.nombre = "Tomas";
    }

    registrar_personal(persona, tipo){
        if(tipo === "tecnico"){
            Ferreteria.tecnicos.push(persona);
        }    
        else{
            Ferreteria.vendedores.push(persona);
        }
    }
    
    registrar_cliente(cliente){
        Ferreteria.clientes.push(cliente);
    }
    
    crear_orden(cliente, fecha, vendedor){
        const nueva_orden = new OrgdenDeCompra(cliente, fecha, vendedor);
        return nueva_orden;
    }
    
    agregar_item_orden(orden, item){ // el item es un objeto con: {Nombre: nombre, Cantidad: x, Precio: x, Detalle: lalalal}
        orden.agregar_item(item);
        console.log("Se agrego el item: " + item + ", a la compra.");
        Ferreteria.ordenes.push(orden.detalle_completo());
    }
    
    mostrar_orden(cliente){
        let numero = 0;

        for(let i = 0; i < Ferreteria.clientes.length; i++){
            if(cliente === Ferreteria.clientes[i].Numero){
                numero = i;
                break;
            }
        }

        return Ferreteria.ordenes[numero];
    }

    listar_vendedores_por_sector(sector){

    }
}

class Vendedor extends Persona{
    constructor(nombre, dni, edad, cogigo_empleado, sector){
        super(nombre, dni, edad);
        this.cogigo_empleado = cogigo_empleado;
        this.sector = sector;
    }

    realizar_venta(cliente, fecha, producto){
        const venta = new Ferreteria();
        
        let orden = venta.crear_orden(cliente, fecha, this._nombre);

        venta.agregar_item_orden(orden, producto);

        let mostar = venta.mostrar_orden(cliente);

        console.log(mostar);
    }

    get_vendedor(){
        return {Nombre: this._nombre, Edad: this._edad, DNI: this._dni, Sector: this.sector, Codigo: this.cogigo_empleado};
    }
}

class Tecnico extends Persona{
    constructor(nombre, dni, edad, especialidad, turno){
        super(nombre, dni, edad);
        this.especialidad = especialidad;
        this.turno = turno;
    }

    asesorar_cliente(cliente, producto){
        // imprime recomendación técnica.
    }
}

class Cliente extends Persona{
    constructor(nombre, dni, edad, numero_cliente, categoria){
        super(nombre, dni, edad);
        this.numero_cliente = numero_cliente;
        this.categoria = categoria;
    }

    consultar_producto(nombre_producto){
        const consulat = new Ferreteria();

        let productos = consulat.mostrar_orden();

        for(let i = 0; i < productos.length; i++){
            if(nombre_producto === producto[i].Nombre){
                console.log(producto[i]);
                break;
            }
        }
    }

    get_clente(){
        return {Nombre: this._nombre, Edad: this._edad, DNI: this._dni, Numero: this.numero_cliente, Categoria: this.categoria}
    }
}

const mi_ferreteria = new Ferreteria();

const vendedor1 = new Vendedor("Mario", 123123, 20, 1, "Electricidad");
const vendedor2 = new Vendedor("Lara", 132123, 30, 2, "Agua y gas");
const cliente1 = new Cliente("Juan", 13132, 21, 1, "Particular");
const cliente2 = new Cliente("Luci", 1332, 15, 2, "Empresa");

mi_ferreteria.registrar_personal(vendedor1.get_vendedor(), "Vendedor");
mi_ferreteria.registrar_personal(vendedor2.get_vendedor(), "Vendedor");

mi_ferreteria.registrar_cliente(cliente1.get_clente());
mi_ferreteria.registrar_cliente(cliente1.get_clente());

vendedor1.realizar_venta(1, "15/10", {Nombre: "Capacitor", Cantidad: 2, Precio: 150, Detalle: "lalalal"});
vendedor2.realizar_venta(2, "15/10", {Nombre: "Codo", Cantidad: 1, Precio: 15, Detalle: "lalalal"});
