const lib_c = require("./consts");
const bcrypt = require('bcrypt');  //npm install bcrypt

class Producto {
    static vec_productos=[];
    static load=false;
    static categs=["", "calzado", "campera", "pantalones"];
    
    constructor(id, marca, modelo, precio, stock) {
        this.id=id;
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.stock = stock;
        this.tipo = "";
    }

    getDetalles() {
        return `${this.id}). ${this.marca} ${this.modelo}`;
    }

    static addProducto(prd) {
        Producto.vec_productos.push(prd);
    }

    static getProductos(){
        let rta="";
        for (let i=0; i<Producto.vec_productos.length;i++) {rta+=Producto.vec_productos[i].getDetalles()+"<br>";}
        return rta;
        }

//devuelve drop down de producto
static getDDProductos(){
    let rta="<select id='id_producto' name='id_producto'><option value='0'>Seleccionar producto</option>";
    for (let i=0; i<Producto.vec_productos.length;i++) {
        rta+="<option value='"+Producto.vec_productos[i].id+"'>"+Producto.vec_productos[i].marca+", "+Producto.vec_productos[i].modelo+"</option>";}
    return rta+"</select>";
    }        
//array en navegador para agregar drop down en nueva venta
static get_vec_js_productos(){
    let rta="const vec_prds=[";
    for (let i=0; i<Producto.vec_productos.length;i++) {
        rta+="{id:"+Producto.vec_productos[i].id+", marca:'"+Producto.vec_productos[i].marca+"', modelo: '"+Producto.vec_productos[i].modelo+"', precio: "+Producto.vec_productos[i].precio+", categoria: "+Producto.vec_productos[i].category+"},";}
    return rta+"];";
    }        

    static async cargar_vec() {
        let conn, rows;
        try {
            conn = await lib_c.pool.getConnection();
            rows = await conn.query("select id_producto, marca, modelo, id_categoria, precio, stock, talles, material, ancho, largo, temporada, color "+ 
                                    "from productos order by id_categoria");
            for (let i in rows) {
                if  (rows[i].id_categoria==1) {Producto.addProducto(new Calzado(rows[i].id_producto, rows[i].marca, rows[i].modelo, rows[i].precio, rows[i].stock, rows[i].talles, rows[i].material)); }
                else if  (rows[i].id_categoria==2) {Producto.addProducto(new Campera(rows[i].id_producto, rows[i].marca, rows[i].modelo, rows[i].precio, rows[i].stock, rows[i].talles, rows[i].temporada, rows[i].color)); }
                else if  (rows[i].id_categoria==3) {Producto.addProducto(new Pantalon(rows[i].id_producto, rows[i].marca, rows[i].modelo, rows[i].precio, rows[i].stock, rows[i].ancho, rows[i].largo)); }
                }
            }
        catch (err) {
            console.log(err);
            return{rta: false, msg: err};} 
        finally { 
            if (conn) await conn.release();
            }
        Producto.load=true;
        return {rta: true, msg:''};

        }

    static async insert_producto(prd) {
    let rta = "";
	const conn = await lib_c.pool.getConnection(), query="insert into productos  (marca, modelo, precio, stock, id_categoria, talles, material, temporada, color, ancho, largo) "+
                                    "Values ('"+prd.marca+"', '"+prd.modelo+"', "+prd.precio+", "+prd.stock+", "+prd.categ+", '"+prd.talles+"', '"+prd.material+"', '"+prd.temporada+"', '"+prd.color+"', '"+prd.ancho+"', '"+prd.largo+"')";
	try {
			const r=await conn.query(query);
			rta="OK. affectedRows:"+r.affectedRows.toString()+", insertId:"+r.insertId.toString();

            if (prd.categ==1) {Producto.addProducto(new Calzado(r.insertId.toString(), prd.marca, prd.modelo, prd.precio, prd.stock, prd.talles, prd.material));}
            else if (prd.categ==2) {Producto.addProducto(new Campera(r.insertId.toString(), prd.marca, prd.modelo, prd.precio, prd.stock, prd.talles, prd.temporada, prd.color));}
            else if (prd.categ==3) {Producto.addProducto(new Pantalon(r.insertId.toString(), prd.marca, prd.modelo, prd.precio, prd.stock, prd.ancho, prd.largo));}
            Producto.load=false;
		}
	catch (err) {console.log("error en funcion insert\n"+err);rta=err;} 
	finally { 
		if (conn)  await conn.end();
		return rta;
		}
    } 

}

// Subclasses de Producto
class Pantalon extends Producto {
    constructor(id, marca, modelo, precio, stock, ancho, largo) {
        super(id, marca, modelo, precio, stock);
        this.ancho = ancho;
        this.largo = largo;
        this.category = 3;
    }

    getDetalles() {
        return `${super.getDetalles()} (${Producto.categs[this.category]}) - Ancho: ${this.ancho} - Largo: ${this.largo}`;
    }
}

class Calzado extends Producto {
    constructor(id, marca, modelo, precio, stock, talles, material) {
        super(id, marca, modelo, precio, stock);
        this.talles = talles;
        this.material = material;
        this.category = 1;
    }

    getDetalles() {
        return `${super.getDetalles()} (${Producto.categs[this.category]}) - talle: ${this.talles}, Material: ${this.material}`;
    }
}

class Campera extends Producto {
    constructor(id, marca, modelo, precio, stock, talles, temporada, color) {
        super(id, marca, modelo, precio, stock);
        this.temporada = temporada;
        this.talles = talles;
        this.color = color;
        this.category = 2;
    }

    getDetalles() {
        return `${super.getDetalles()} (${Producto.categs[this.category]}) - Temporada: ${this.temporada}, Talles: ${this.talles}, Color: ${this.color}`;
    }
}




class Empleado {

    static vec_empleados=[];
    static load=false;

    constructor(id='',nombre, apellido,dni, rol) {
        this.nombre = nombre;
        this.apellido=apellido;
        this.dni=dni
        this.rol = rol;
        this.id=id;
    }

static getEmpleados(){
    let rta="";
    for (let i=0; i<Empleado.vec_empleados.length;i++) {rta+=Empleado.vec_empleados[i].getDetalles()+"<br>";}
    return rta;
    }

static addEmpleado(emp) {
    Empleado.vec_empleados.push(emp);
}

//devuelve drop down de empleados
static getDDEmpleados(){
    //console.log("ingreso a get drop down empleados: "+Empleado.vec_empleados.length);
    let rta="<select id='id_empleado' name='id_empleado'><option value='0'>Seleccionar empleado</option>";
    for (let i=0; i<Empleado.vec_empleados.length;i++) {
        rta+="<option value='"+Empleado.vec_empleados[i].id+"'>"+Empleado.vec_empleados[i].nombre+" "+Empleado.vec_empleados[i].apellido+"</option>";}
    return rta+"</select>";
    }

getDetalles () {
    return this.id+". "+this.apellido+", "+this.nombre+", "+this.dni+", "+this.rol;
}

static async cargar_vec() {
        let conn, rows;
        try {
            conn = await lib_c.pool.getConnection();
            rows = await conn.query("select id_empleado, nombre_empleado, apellido_empleado, dni_empleado, rol_empleado "+ 
                                    "from empleados");
            for (let i in rows) {
                Empleado.addEmpleado(new Empleado(rows[i].id_empleado, rows[i].nombre_empleado, rows[i].apellido_empleado, rows[i].dni_empleado, rows[i].rol_empleado));
                }
            } 
        catch (err) {
            console.log(err);
            return{rta: false, msg: err};
            } 
        finally {
            if (conn) await conn.release();
            }
        Empleado.load=true;
        return {rta: true, msg:''};
        }


static async insert_empleado(emp) {
    let rta = "";
	const conn = await lib_c.pool.getConnection(), query="insert into empleados  (nombre_empleado, apellido_empleado, dni_empleado, rol_empleado) "+
                                    "Values ('"+emp.nombre+"', '"+emp.apellido+"', '"+emp.dni+"', '"+emp.rol+"')";
	try {
			const r=await conn.query(query);
			rta="OK. affectedRows:"+r.affectedRows.toString()+", insertId:"+r.insertId.toString();
            Empleado.addEmpleado(new Empleado(r.insertId.toString(), emp.nombre, emp.apellido, emp.dni, emp.rol));
            Empleado.load=false;
        }
	catch (err) {console.log("error en funcion insert\n"+err);rta=err;} 
	finally { 
		if (conn)  await conn.release();
		return rta;
		}
    }

}


class Venta {

    static vec_ventas=[];
    static load=false;

    constructor(id='',total, id_empleado ,fecha, dni_cliente, detalle) { //detalle:  [{id_prducto: ##, cantidad: ##, precio:##}, {id_prducto: ##, cantidad: ##, precio:##}]
        this.total = total;
        this.id_empleado=id_empleado
        this.fecha=fecha;
        this.dni_cliente = dni_cliente;
        this.detalle = detalle;
        this.id=id;
    }

static getVentas(){
    let rta="";
    for (let i=0; i<Venta.vec_ventas.length;i++) {rta+=Venta.vec_ventas[i].getDetalles()+"<br>";}
    return rta;
    }

static addVenta(venta) {
    Venta.vec_ventas.push(venta);
}


getDetalles () {
    return this.id+". "+this.id_empleado+", dni cliente: "+this.dni_cliente+", $"+this.total+", "+this.fecha+", "+this.detalle;
}

static async cargar_vec() {
        let conn, rows;
        try {
            conn = await lib_c.pool.getConnection();
            rows = await conn.query("select id_venta, id_empleado, total_importe, dni_cliente, DATE_FORMAT(fecha , '%d/%m/%Y') as fecha "+ 
                                    "from ventas");
            for (let i in rows) {
                Venta.addVenta(new Venta(rows[i].id_venta, rows[i].total_importe, rows[i].id_empleado, rows[i].fecha, rows[i].dni_cliente, [{id_prducto: '1', cantidad: '11', precio:'22'}, {id_prducto: '2', cantidad: '5', precio:'55000'}]));
                }
            } 
        catch (err) {
            console.log(err);
            return{rta: false, msg: err};
            } 
        finally {
            if (conn) await conn.release();
            }
        Venta.load=true;
        return {rta: true, msg:''};
        }


static async insert_venta(venta) {
    let rta = "";
	const conn = await lib_c.pool.getConnection(), query="insert into ventas  (id_empleado, total_importe, fecha, dni_cliente) "+
                                    "Values ("+venta.id_empleado+", "+venta.total+", CURRENT_TIMESTAMP, '"+venta.dni_cliente+"')";
	try {
			const r=await conn.query(query);
			rta="OK. affectedRows:"+r.affectedRows.toString()+", insertId:"+r.insertId.toString();
            Venta.addVenta(new Venta(r.insertId.toString(), venta.total, venta.id_empleado, venta.fecha, venta.dni_cliente, venta.detalle));
		}
	catch (err) {console.log("error en funcion insert\n"+err);rta=err;} 
	finally { 
		if (conn)  await conn.end();
		return rta;
		}
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



module.exports = {Producto, Empleado, Venta, Login }