// Clase vehículo 
class Vehiculo {
	#disponible;

	constructor(matricula, marca, modelo, precioPorDia) {
		this.matricula = matricula;
		this.marca = marca;
		this.modelo = modelo;
		this.precioPorDia = precioPorDia;
		this.#disponible = true;
	}

	estaDisponible() {
		return this.#disponible;
	}

	alquilar() {
		if (!this.#disponible) {
			throw new Error(` El vehículo ${this.matricula} no está disponible`);
		}
		this.#disponible = false;
	}

	devolver() {
		this.#disponible = true;
	}

	getInfo() {
		return ` ${this.constructor.name} - ${this.marca} ${this.modelo} (${this.matricula}) - $${this.precioPorDia}/día - ${this.#disponible ? "Disponible" : "Alquilado"}`;
	}
}

// Subclases
class Auto extends Vehiculo {}
class Moto extends Vehiculo {}
class Camioneta extends Vehiculo {}


// Cliente
class Cliente {
	constructor(nombre, dni) {
		this.nombre = nombre;
		this.dni = dni;
	}

	getInfo() {
		return `${this.nombre} (DNI: ${this.dni})`;
	}
}


// Alquiler
class Alquiler {
	constructor(cliente, vehiculo, fechaInicio, fechaFin) {
		this.cliente = cliente;
		this.vehiculo = vehiculo;
		this.fechaInicio = new Date(fechaInicio);
		this.fechaFin = new Date(fechaFin);
	}

	getDias() {
		const diffMs = this.fechaFin - this.fechaInicio;
		const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
		return dias;
	}

	getCostoTotal() {
		return this.getDias() * this.vehiculo.precioPorDia;
	}

	getResumen() {
		return ` ${this.cliente.getInfo()} alquiló ${this.vehiculo.marca} ${this.vehiculo.modelo} del ${this.fechaInicio.toDateString()} al ${this.fechaFin.toDateString()} | Total: $${this.getCostoTotal()}`;
	}
}


// Agencia
class Agencia {
	constructor(nombre) {
		this.nombre = nombre;
		this.vehiculos = [];
		this.alquileres = [];
	}

	agregarVehiculo(vehiculo) {
		this.vehiculos.push(vehiculo);
	}

	listarVehiculos() {
		console.log(`\n Vehículos en ${this.nombre}:`);
		for (let i = 0; i < this.vehiculos.length; i++) {
			console.log(this.vehiculos[i].getInfo());
		}
	}

	listarAlquileres() {
		console.log(`\n Alquileres en ${this.nombre}:`);
		for (let i = 0; i < this.alquileres.length; i++) {
			console.log(this.alquileres[i].getResumen());
		}
	}

	buscarVehiculoDisponible(tipoDeseado) {
		for (let i = 0; i < this.vehiculos.length; i++) {
			const vehiculo = this.vehiculos[i];
			if (vehiculo instanceof tipoDeseado && vehiculo.estaDisponible()) {
				return vehiculo;
			}
		}
		return null;
	}

	realizarAlquiler(cliente, tipoVehiculo, fechaInicio, fechaFin) {
		const vehiculo = this.buscarVehiculoDisponible(tipoVehiculo);
		if (vehiculo) {
			vehiculo.alquilar();
			const alquiler = new Alquiler(cliente, vehiculo, fechaInicio, fechaFin);
			this.alquileres.push(alquiler);
			console.log(` Alquiler realizado:\n${alquiler.getResumen()}`);
		} else {
			console.log(` No hay vehículos del tipo solicitado disponibles.`);
		}
	}

	devolverVehiculo(matricula) {
		const alquiler = this.alquileres.find(a => a.vehiculo.matricula === matricula && !a.vehiculo.estaDisponible());
		if (alquiler) {
			alquiler.vehiculo.devolver();
			console.log(` Vehículo ${matricula} devuelto correctamente por ${alquiler.cliente.nombre}.`);
		} else {
			console.log(` No se encontró un alquiler activo para la matrícula ${matricula}.`);
		}
	}
}


// ejemplo con una agencia
const agencia = new Agencia("RentaYa");

// Vehículos
agencia.agregarVehiculo(new Auto("AAA111", "Toyota", "Corolla", 80));
agencia.agregarVehiculo(new Moto("MOT222", "Honda", "CB500", 50));
agencia.agregarVehiculo(new Camioneta("CAM333", "Ford", "Ranger", 120));

// Cliente
const cliente1 = new Cliente("Juan Pérez", "12345678");

// Alquiler
agencia.realizarAlquiler(cliente1, Auto, "2025-05-10", "2025-05-13");

// Alquileres actuales
agencia.listarAlquileres();

// Devolver vehículo
agencia.devolverVehiculo("AAA111");

// Ver vehículos tras devolución
agencia.listarVehiculos();



