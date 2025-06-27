class Reloj {
    // Constructor con valores por defecto
    constructor(horas = 0, minutos = 0, segundos = 0) {
        this.horas = Math.min(Math.max(0, horas), 23);
        this.minutos = Math.min(Math.max(0, minutos), 59);
        this.segundos = Math.min(Math.max(0, segundos), 59);
        }

    // Método para avanzar un segundo
    avanzar() {
        // Incrementar segundos
        this.segundos++;
        if (this.segundos > 59) {
            this.segundos = 0;
            this.minutos++;

            if (this.minutos > 59) {
                this.minutos = 0;
                this.horas++;

                if (this.horas > 23) {
                    this.horas = 0;
                    }
                }
            }
        }

    // Método para formatear y mostrar el tiempo
    mostrarTiempo() {
        // Usar padStart para asegurar dos dígitos
        const horasFormateadas = String(this.horas).padStart(2, '0');
        const minutosFormateados = String(this.minutos).padStart(2, '0');
        const segundosFormateados = String(this.segundos).padStart(2, '0');

        return `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
    }

    // Método para establecer tiempo manualmente
    establecerTiempo(horas, minutos, segundos) {
        this.horas = Math.min(Math.max(0, horas), 23);
        this.minutos = Math.min(Math.max(0, minutos), 59);
        this.segundos = Math.min(Math.max(0, segundos), 59);
    }


    static demo(p_reloj) {
    console.log("Demostración del Reloj Digital:");
    console.log("Tiempo inicial:", p_reloj.mostrarTiempo());

    // Avanzar varios segundos para mostrar el cambio
    for (let i = 0; i < 5; i++) {
        p_reloj.avanzar();
        console.log(`Después de avanzar ${i+1} segundo(s):`, p_reloj.mostrarTiempo());
        }

    // Establecer un tiempo específico
    p_reloj.establecerTiempo(10, 30, 45);
    console.log("Tiempo establecido manualmente:", p_reloj.mostrarTiempo());
    }

    static esperarSegundos(segundos) {
        return new Promise(resolve => setTimeout(resolve, segundos * 1000));
    }

    static async  relojAsync(reloj, intervalos = 10) {
        console.log("⏳ Reloj inicial:", reloj.mostrarTiempo());
        for (let i = 1; i < intervalos; i++) {
            await Reloj.esperarSegundos(1);
            reloj.avanzar();
            console.log("⏰ Tiempo actual:", reloj.mostrarTiempo());
        }
        console.log("⏹️ Reloj detenido.");
    }

    static async demoRelojesAsync(obj_reloj1, obj_reloj2) {
        let reloj1 = new Reloj(obj_reloj1.hora, obj_reloj1.mins, obj_reloj1.secs);
        await Reloj.relojAsync(reloj1, obj_reloj1.veces);  // Espera que el primer reloj termine
    
        let reloj2 = new Reloj(obj_reloj2.hora, obj_reloj2.mins, obj_reloj2.secs);
        await Reloj.relojAsync(reloj2, obj_reloj2.veces);  // Comienza después del primero
    }

}

// ide: integrated developement environment (. base de datos (mysql (mariadb)-postgresql) . lenguaje de programacion (js-nodejs) . webserver (expressjs))



// funcion uso interactivo
function ejemploUsoInteractivo(p_reloj, intervalos=11) {
    let k_insts=0;
    console.log("Reloj inicial:", p_reloj.mostrarTiempo());
    // Simular paso del tiempo
    const intervalId = setInterval(() => {
        p_reloj.avanzar();
        k_insts++;
        console.log("Tiempo actual:", p_reloj.mostrarTiempo());
        // Detener después de 10 avances 
        if (intervalos==k_insts) {
            clearInterval(intervalId);
            }
        }, 1000);
    }


    
    

    

// demostración basica
//let reloj = new Reloj(14, 59, 59);
//Reloj.demo(reloj);


// uso interactivo
/*
ejemploUsoInteractivo(reloj);
reloj  = new Reloj(23, 59, 59);
ejemploUsoInteractivo(reloj);
*/

// uso asincronico
Reloj.demoRelojesAsync({hora:11, mins:32, secs:56, veces:5},{hora:23, mins:59, secs:57, veces:7});