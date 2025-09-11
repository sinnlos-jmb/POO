/*
14. Ejercicio: Sistema de Reservas de Hotel (con Composición y Herencia)
-----------------------------------------------------------------------
📌 Objetivo: Diseñar un sistema de reservas aplicando herencia y composición.
🔹 Tarea:
   - Crear una clase `Cama` para describir las camas.
   - Modificar la clase `Habitacion` para que contenga una lista de camas (composición).
   - Las subclases de `Habitacion` definirán qué camas específicas contienen.
*/

// --- Clase para la Composición ---  composicion: la herencia entre subclases y clases, se explica mediante la expresión ES_UN (la subclase ES_UN clase, por ejemplo, el Leon ES_UN Animal). La composicion es también una relación entre clases pero se explica mediante la expresión TIENE
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

// --- Clases Hotel y Reserva (sin cambios) ---
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
        console.log(`\n🏨 Habitaciones disponibles en ${this.nombre}:`);
        this.habitaciones.forEach(h => console.log(h.getInfo()));
    }

    buscarHabitacionDisponible(tipoDeseado) {
        return this.habitaciones.find(h => h.tipo === tipoDeseado && h.estaDisponible());
    }

    realizarReserva(nombreHuesped, tipoHabitacion, fechaInicio, fechaFin) {
        const habitacion = this.buscarHabitacionDisponible(tipoHabitacion);
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



// --- Demostración ---

const hotelGranVia = new Hotel("Hotel Gran Vía");
console.log(`Bienvenido al ${hotelGranVia.nombre}`);
hotelGranVia.listarHabitaciones();
hotelGranVia.listarReservas();

// Agregar habitaciones que ahora contienen camas
hotelGranVia.agregarHabitacion(new HabitacionSimple(101, 60));
hotelGranVia.agregarHabitacion(new HabitacionDoble(201, 95));
hotelGranVia.agregarHabitacion(new HabitacionDoble(202, 95));
hotelGranVia.agregarHabitacion(new Suite(301, 200, ['Vista panorámica', 'Servicio a la habitación 24h']));

// Mostrar habitaciones y sus camas
hotelGranVia.listarHabitaciones();

// Realizar una reserva
hotelGranVia.realizarReserva("Elena Ríos", "doble", "2025-10-15", "2025-10-18");

// Ver el estado final de las habitaciones
hotelGranVia.listarHabitaciones();