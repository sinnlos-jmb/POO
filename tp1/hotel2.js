/*  dejar como modulo: clase DB_mariadb.js como modulo importable, express webserver -> micro-app (cuasi-mvp)
14. Ejercicio: Sistema de Reservas de Hotel (con Composición y Herencia)
-----------------------------------------------------------------------
📌 Objetivo: Diseñar un sistema de reservas aplicando herencia y composición.
🔹 Tarea:
   - Crear una clase `Cama` para describir las camas.
   - Modificar la clase `Habitacion` para que contenga una lista de camas (composición).
   - Las subclases de `Habitacion` definirán qué camas específicas contienen.
*/


const mariadb = require("mariadb");

class Cama {
    constructor(tipo, tamano, peso=100) {
        this.tipo = tipo;     // 'Individual', 'Matrimonial'
        this.tamano = tamano; // 'Queen', 'King', 'Standard'
        this.peso_max=peso;
    }

    getInfo() {
        return `${this.tipo} (${this.tamano}, peso maximo: ${this.peso_max})`;
    }
}

// --- Clase Base o "Padre" ---
class Habitacion {
    #disponible;
    constructor(numero, tipo, precio) {
        this.numero = numero;
        this.tipo = tipo;
        this.precio = precio;
        this.camas = []; // <-- AQUÍ OCURRE LA COMPOSICIÓN
        this.#disponible = true;
        }

    agregarCama(cama) {
        this.camas.push(cama);
        }

    estaDisponible() {
        return this.#disponible;
    }

    reservar() {
        if (!this.estaDisponible()) {
            throw new Error(`🚫 Habitación ${this.numero} no está disponible`);
        }
        this.#disponible = false;
    }

    liberar() {
        this.#disponible = true;
    }

    getInfo() {
        // Obtenemos la descripción de cada cama en la lista
        const infoCamas = this.camas.map(cama => cama.getInfo()).join(', ');
        return `🛏️ Habitación ${this.numero} (${this.tipo}) - $${this.precio}/noche - ${this.estaDisponible() ? "✅ Disponible" : "❌ Ocupada"}\n    camas: [${infoCamas}]`;
    }
}

// --- Subclases que heredan de Habitacion ---

class HabitacionSimple extends Habitacion {
    constructor(numero, precio) {
        super(numero, 'simple', precio);
        // Composición: Esta habitación "tiene" una cama.
        this.agregarCama(new Cama('Individual', 'Standard', 120));
    }
}

class HabitacionDoble extends Habitacion {
    constructor(numero, precio) {
        super(numero, 'doble', precio);
        // Composición: Esta habitación "tiene" dos camas.
        this.agregarCama(new Cama('Individual', 'Standard'));
        this.agregarCama(new Cama('Individual', 'Standard'));
    }
}

class Suite extends Habitacion {
    constructor(numero, precio, serviciosExtra) {
        super(numero, 'suite', precio);
        this.serviciosExtra = serviciosExtra || ['Minibar', 'Jacuzzi'];
        this.agregarCama(new Cama('Matrimonial', 'King', 200));
    }

    getInfo() {
        const infoBase = super.getInfo();
        return `${infoBase}\n   ✨ Servicios Extra: ${this.serviciosExtra.join(', ')}`;
    }
}

// --- Clases Hotel y Reserva 
class Reserva {
    constructor(nombreHuesped, habitacion, fechaInicio, fechaFin) {
        this.nombreHuesped = nombreHuesped;
        this.habitacion = habitacion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    getResumen() {
        return `📅 Reserva para ${this.nombreHuesped} - Habitación ${this.habitacion.numero} (${this.habitacion.tipo}) - del ${this.fechaInicio} al ${this.fechaFin}`;
    }
}

class Hotel {
    constructor(nombre) {
        this.nombre = nombre;
        this.habitaciones = [];
        this.reservas = [];
    }

    agregarHabitacion(habitacion) {
        this.habitaciones.push(habitacion);
    }

    listarHabitaciones() {
        console.log(`\nHabitaciones disponibles en ${this.nombre}:`);
        this.habitaciones.forEach(h => console.log(h.getInfo()));
    }

    buscarHabitacionDisponible(tipoDeseado) {
        return this.habitaciones.find(h => h.tipo === tipoDeseado && h.estaDisponible());
    }

    realizarReserva(nombreHuesped, tipoHabitacion, fechaInicio, fechaFin) {
        const habitacion = this.buscarHabitacionDisponible(tipoHabitacion);
        //validar fechas
        if (habitacion) {
            habitacion.reservar();
            const reserva = new Reserva(nombreHuesped, habitacion, fechaInicio, fechaFin);
            this.reservas.push(reserva);
            console.log(`\n✅ Reserva realizada con éxito:\n${reserva.getResumen()}`);
        } else {
            console.log(`\n❌ Lo sentimos, no hay habitaciones de tipo '${tipoHabitacion}' disponibles.`);
        }
    }

    listarReservas() {
        console.log(`\n📚 Reservas actuales en ${this.nombre}:`);
        this.reservas.forEach(r => console.log(r.getResumen()));
    }
}

// 
class Agencia { 
    #hoteles = [];
    constructor(nombreAgencia, telefono, email) {
        this.nombreAgencia = nombreAgencia;
        this.telefonoAgencia = telefono;
        this.emailAgencia = email;
    }

    AgregarHotel (o_hotel) {
        this.#hoteles.push(o_hotel);
    }

    getListadoHoteles () {
        let rta="";
        this.#hoteles.forEach(function(hotel) {   //vec1=[{nombre:"conrad", estrellas:5},{nombre:"hilton", estrellas:4}, {nombre:"sheraton", estrellas:5}]
                rta+=hotel.nombre +"\n";        //vec1.forEach(function(p_hotel) {console.log(p_hotel.nombre+", estrellas: "+p_hotel.estrellas);})
                });
    /*
    sintaxis alternativas: arrow function y for tradicional
        this.hoteles.forEach(hotel => {
            rta += hotel.nombre + "\n";
            });

        for (let i=0; i<this.#hoteles.length; i++) {
            rta += hotel.nombre + "\n";
            }
    */
        return rta;
    }

    getResumen() {
        return ` Agencia: ${this.nombreAgencia} - contacto ${this.telefonoAgencia}\nHoteles asociados:\n${this.getListadoHoteles()}`;
    }
}

 

class MariaDB {
    #conn = null;   // conexión privada
    #pool = null;   // pool privado

    constructor(config) {
        this.config = config;
        this.#pool = mariadb.createPool(config);
    }

    async conectar() {
        try {
            this.#conn = await this.#pool.getConnection();
            console.log("✅ Conectado a MariaDB");
        } catch (error) {
            console.error("❌ Error al conectar a MariaDB:", error);
        }
    }

    async crearTabla(nombre, columnas) {
        try {
            await this.#conn.query(`CREATE TABLE IF NOT EXISTS ${nombre} (${columnas})`);
            console.log(`📄 Tabla '${nombre}' creada.`);
        } catch (error) {
            console.error("❌ Error al crear la tabla:", error);
        } finally {
            if (this.#conn) this.#conn.release();
        }
    }

    async cargarDatos(nombreTabla, datos) {
        try {
            const keys = Object.keys(datos).join(", ");
            const values = Object.values(datos).map(val => `'${val}'`).join(", ");
            await this.#conn.query(`INSERT INTO ${nombreTabla} (${keys}) VALUES (${values})`);
            console.log(`📥 Datos insertados en '${nombreTabla}'.`);
        } catch (error) {
            console.error("❌ Error al cargar datos:", error);
        } finally {
            if (this.#conn) this.#conn.release();
        }
    }

    async ejecutarQuery(sql) {
        try {
            const resultados = await this.#conn.query(sql);
            console.log("🔍 Resultados:", resultados);
            return resultados;
        } catch (error) {
            console.error("❌ Error al ejecutar query:", error);
        } finally {
            if (this.#conn) this.#conn.release();
        }
    }

    async cerrarConexion() {
        try {
            if (this.#conn) {
                await this.#conn.end();
                console.log("🔌 Conexión cerrada.");
            }
            if (this.#pool) {
                await this.#pool.end();
                console.log("🏁 Pool de conexiones cerrado.");
            }
        } catch (error) {
            console.error("❌ Error al cerrar la conexión:", error);
        }
    }
}



async function pr_db() {
        const db = new MariaDB({
                host: "localhost",
                user: "manu",
                password: "1234",
                database: "poo_hotel"
            });

        try {
            await db.conectar();
            //await db.crearTabla("usuarios", "id SERIAL PRIMARY KEY, nombre VARCHAR(50), edad INT");
            //await db.cargarDatos("usuarios", { nombre: "Pedro", edad: 42 });
            const resultados=await db.ejecutarQuery("SELECT * FROM Hoteles");
            console.log("🔍 Resultados:", resultados);
            return resultados;
        } catch (error) {
            console.error("❌ Error al ejecutar query:", error);
            }
        finally{ await db.cerrarConexion(); }
    }


    
// --- Demostración ---

//const vec1=[{nombre:"conrad", estrellas:5},{nombre:"hilton", estrellas:4}, {nombre:"sheraton", estrellas:5}];
//vec1.forEach(function(p_hotel) {console.log(p_hotel.nombre+", estrellas: "+p_hotel.estrellas);});

pr_db();
const hotel1 = new Hotel("Hotel Gran Vía");
console.log(`Bienvenido al ${hotel1.nombre}`);
hotel1.listarHabitaciones();
hotel1.listarReservas();

// Agregar habitaciones1133551188 que ahora contienen camas
hotel1.agregarHabitacion(new HabitacionSimple(101, 60));
hotel1.agregarHabitacion(new HabitacionDoble(201, 95));
hotel1.agregarHabitacion(new HabitacionDoble(202, 95));
hotel1.agregarHabitacion(new Suite(301, 200, ['Vista panorámica', 'Servicio a la habitación 24h']));

// Mostrar habitaciones y sus camas
hotel1.listarHabitaciones();

// Realizar una reserva
hotel1.realizarReserva("Elena Ríos", "doble", "2025-10-15", "2025-10-18");

// Ver el estado final de las habitaciones
hotel1.listarHabitaciones();

const ag1=new Agencia ("agencia1", "1133561188", "ag@gmail.com");
ag1.AgregarHotel(hotel1);
const hotel2=new Hotel("sheraton");
ag1.AgregarHotel(hotel2);

try {
    console.log(ag1.hoteles.length); // error porque no existe el atributo 'hoteles' tendría que tener el signo de privado # 
    }                               // si intento ejecutar la instrucción ag1.#hoteles.length da un error de sintaxis no capturable con try--catch porque estoy intentando acceder a un atributo privado desde fuera de la clase.
catch (e) {
    console.log("Capturo error!\nnombre del error: "+e.name+"\nmensaje del error: "+e.message);
    }
finally {

}