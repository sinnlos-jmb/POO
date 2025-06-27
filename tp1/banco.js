// Definición de la clase CuentaBancaria
class CuentaBancaria {
    #saldo;
    // Constructor: Se invoca cuando se crea una nueva instancia de CuentaBancaria. Recibe tres parámetros: número de cuenta, nombre del titular y saldo inicial
    constructor(numeroCuenta, nombreTitular, saldoInicial) {
        this._numeroCuenta = numeroCuenta;
        this._nombreTitular = nombreTitular;
        this.#saldo = saldoInicial; 
    }

    // Método para mostrar los detalles completos de la cuenta
    mostrarDetallesCuenta() {
        console.log(`Número de Cuenta: ${this._numeroCuenta}`);
        console.log(`Nombre del Titular: ${this._nombreTitular}`);
        console.log(`Saldo: ${this.#saldo} $`);
    }

    // Método para realizar un depósito en la cuenta. Aumenta el saldo con el monto ingresado y muestra los nuevos detalles
    depositar(monto) {
        
        if (monto > 0) {    // Validación básica: el monto debe ser positivo
            this.#saldo += monto;
            console.log(`Depósito de ${monto} $ realizado con éxito.`);
            this.mostrarDetallesCuenta();
        } else {
            console.log("El monto del depósito debe ser positivo.");
        }
    }

    // Método para realizar un retiro de la cuenta
    retirar(monto) {
        // Primero verifica si hay saldo suficiente
        if (this.#saldo >= monto) {
            this.#saldo -= monto;
            console.log(`Retiro de ${monto} $ realizado con éxito.`);
            this.mostrarDetallesCuenta();
        } else {
            console.log("Saldo insuficiente para realizar el retiro.");
        }
    }

    // Método getter para obtener el saldo actual (buena práctica de encapsulamiento)
    obtenerSaldo() {
        return this.#saldo;
    }
}

// Función de demostración para mostrar el uso de la clase
function demostracion() {
    // Crear una nueva cuenta bancaria.  Parámetros: nro de cuenta, nombre, saldo inicial
    const miCuenta = new CuentaBancaria("123456", "Juan Pérez", 1000);
    
    // Mostrar detalles iniciales de la cuenta
    console.log("--- Detalles Iniciales ---");
    miCuenta.mostrarDetallesCuenta();
    
    // Realizar un depósito
    console.log("\n--- Después de Depositar ---");
    miCuenta.depositar(500);
    
    // Realizar un retiro
    console.log("\n--- Después de Retirar ---");
    miCuenta.retirar(200);
    
    // Intentar retirar más del saldo disponible
    console.log("\n--- Intento de Retiro Inválido ---");
    miCuenta.retirar(2000);

    miCuenta._saldo=1111111111; //intento cambiar el saldo directamente (sin respetar encapsulamiento. Si no defino #saldo con #, permite modificar la propiedad directamente).
    console.log("solicito saldo despues de cambiar directamente propiedad privada: "+miCuenta.obtenerSaldo());
}

// Ejecutar la demostración
demostracion();