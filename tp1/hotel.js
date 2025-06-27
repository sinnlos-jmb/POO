/*
1️⃣4️⃣ Ejercicio: Sistema de Reservas de Hotel
--------------------------------------
📌 Objetivo: Diseñar un sistema de reservas aplicando encapsulamiento y asociaciones.
🔹 Tarea: Crear clases para `Hotel`, `Habitación` y `Reserva`:
   - `Hotel` con colección de habitaciones.
   - `Habitación` con `número`, `tipo`, `precio` y `disponibilidad`.
   - `Reserva` asociando huéspedes, habitaciones y fechas.
   - Métodos para verificar disponibilidad y realizar reservas.
*/

// Clase Habitación
class Habitacion {
	#disponible;

	constructor(numero, tipo, precio) {
		this.numero = numero;
		this.tipo = tipo; // 'simple', 'doble', 'suite', etc.
		this.precio = precio;
		this.#disponible = true;
	}

	estaDisponible() {
		return this.#disponible;
	}

	reservar() {
		if (!this.#disponible) {
			throw new Error(`🚫 Habitación ${this.numero} no está disponible`);
		}
		this.#disponible = false;
	}

	liberar() {
		this.#disponible = true;
	}

	getInfo() {
		return `🛏️ Habitación ${this.numero} (${this.tipo}) - $${this.precio} - ${this.#disponible ? "Disponible" : "Ocupada"}`;
	}
}

// Clase Reserva
class Reserva {
	constructor(nombreHuesped, habitacion, fechaInicio, fechaFin) {
		this.nombreHuesped = nombreHuesped;
		this.habitacion = habitacion;
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechaFin;
	}

	getResumen() {
		return `📅 Reserva para ${this.nombreHuesped} - Habitación ${this.habitacion.numero} - del ${this.fechaInicio} al ${this.fechaFin}`;
	}
}

// Clase Hotel
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
		//this.habitaciones.forEach(h => console.log(h.getInfo()));
		for (let i = 0; i < this.habitaciones.length; i++) {
    		console.log(this.habitaciones[i].getInfo());
			}
        }

	buscarHabitacionDisponible(tipoDeseado) {
		//return this.habitaciones.find(h=>h.tipo===tipoDeseado&&h.estaDisponible());
		let habitacionEncontrada = null;
		let i = 0;
		for (; i < this.habitaciones.length; i++) {
    		const habitacion = this.habitaciones[i];
    		if (habitacion.tipo === tipoDeseado && habitacion.estaDisponible()) {
        		habitacionEncontrada = habitacion;
        		break; // detenemos el bucle al encontrar la primera coincidencia
    		    }
		    }
		return this.habitaciones[i];
        }

	realizarReserva (nombreHuesped, tipoHabitacion, fechaInicio, fechaFin) {
		const habitacion = this.buscarHabitacionDisponible(tipoHabitacion);
		if (habitacion) {
			habitacion.reservar();
			const reserva = new Reserva (nombreHuesped, habitacion, fechaInicio, fechaFin); // {nom: nombreHuesped}
			this.reservas.push(reserva); //{nombre: nombreHuesped, }
			console.log(`✅ Reserva realizada:\n${reserva.getResumen()}`);
		} else {
			console.log(`❌ No hay habitaciones ${tipoHabitacion} disponibles`);
		}
	}

	listarReservas() {
		console.log(`\n📚 Reservas actuales en ${this.nombre}:`);
		//this.reservas.forEach(r => console.log(r.getResumen()));
		for (let i = 0; i < this.reservas.length; i++) {
    		const reserva = this.reservas[i];
    		console.log(reserva.getResumen());
			}
	}
}


// Crear hotel
const hotelParis = new Hotel("Hotel París");

// Agregar habitaciones
hotelParis.agregarHabitacion(new Habitacion(101, "simple", 50));
hotelParis.agregarHabitacion(new Habitacion(102, "doble", 80));
hotelParis.agregarHabitacion(new Habitacion(103, "doble", 80));
hotelParis.agregarHabitacion(new Habitacion(201, "suite", 1500));
hotelParis.agregarHabitacion(new Habitacion(301, "suite", 1500));

// Mostrar habitaciones
hotelParis.listarHabitaciones();

// Hacer una reserva
hotelParis.realizarReserva("Ana López", "doble", "2025-04-20", "2025-04-22");
hotelParis.realizarReserva("Juan Pérez", "suite", "2025-04-22", "2025-04-25");
hotelParis.realizarReserva("Luis Torres", "doble", "2025-04-23", "2025-04-26");
hotelParis.realizarReserva("Jose Ramon", "suite", "2025-07-23", "2025-07-26");
hotelParis.realizarReserva("Karina Torres", "simple", "2025-04-23", "2025-04-26");
hotelParis.realizarReserva("Jose Ramon", "suite", "2026-07-23", "2026-07-26");

// Ver habitaciones después de reservar
hotelParis.listarHabitaciones();

// Ver reservas
hotelParis.listarReservas();