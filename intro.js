class CuentaBancaria {
  // Atributos privados, solo accesibles dentro de la clase
  #saldo;
  #nroCuenta;
  static tipos_cuenta = ["caja de ahorro", "cuenta sueldo", "cuenta corriente"];

  // Atributo público (por defecto en JS)
  nombreDeBanco;

  constructor(propietario, saldoInicial, nroCuenta, nombreDeBanco) {
    if (saldoInicial < 0) {
      throw new Error("El saldo inicial no puede ser negativo.");
    	}
    this.propietario = propietario;
    this.nombreDeBanco = nombreDeBanco;
    this.#saldo = saldoInicial;
    this.#nroCuenta = nroCuenta;
  }


  // --- Métodos públicos para interactuar con los datos ---
  getSaldo() {
    return this.#saldo;
  }
  getNroCuenta() {
    return this.#nroCuenta;
  }
  getPropietario() {
    return this.propietario;
  }
  getNomBanco() {
    return this.nombreDeBanco;
  }
  // Método para depositar
  depositar(cantidad) {
    if (cantidad > 0) {
      this.#saldo += cantidad;
      console.log(`Depósito de ${cantidad} realizado. Nuevo saldo: ${this.#saldo}`);
    } else {
      console.error("El depósito debe ser una cantidad positiva.");
    }
  }

  // Método para retirar
  retirar(cantidad) {
    if (cantidad > 0 && cantidad <= this.#saldo) {
      this.#saldo -= cantidad;
      console.log(`Retiro de ${cantidad} realizado. Nuevo saldo: ${this.#saldo}`);
    } else {
      console.error("Cantidad de retiro inválida o saldo insuficiente.");
    }
  }
}




// --- Uso de la clase con los nuevos atributos ---
const miCuenta = new CuentaBancaria('Juan Pérez', 500, 'ES12-3456-7890-1234', 'Banco Central');

console.log(`Propietario: ${miCuenta.propietario}`);
console.log(`Banco: ${miCuenta.nombreDeBanco}`); // Acceso directo (es público)
//console.log(`Número de cuenta: ${miCuenta.getNroCuenta()}`); // Acceso a través de un método (es privado)
console.log(miCuenta.tipos_cuenta);
console.log("atributos estaticos, primera posicion de los tipos de cuenta (caja de ahorro): "+CuentaBancaria.tipos_cuenta);


/*/ Intentos de acceso directo (generarán un error)
try {
  console.log(miCuenta.#nroCuenta);
} catch (e) {
  console.error("Error al intentar acceder directamente al número de cuenta:", e.message);
}
*/
