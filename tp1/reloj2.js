class Reloj {
    constructor(horas, minutos, segundos) {
        this.horas = horas;
        this.minutos = minutos;
        this.segundos = segundos;
    }
    
    // Dentro de la clase creo los métodos o funciones
    avanzar() {
        this.segundos += 1; // this.segundos++;

        if (this.segundos === 60) {
            this.segundos = 0;
            this.minutos += 1;
        }

        if (this.minutos === 60) {
            this.minutos = 0;
            this.horas += 1;
        }
if (this.horas === 24) {
            this.horas = 0;
        }
    }

    //metodo para establecer el horario
    establecerTiempo (hh, mm, ss) {
        this.horas=hh;
        this.minutos=mm;
        this.segundos=ss;
    }

	//metodo que muestra el horario
    mostrarTiempo() {
        const hh = this.horas < 10 ? `0${this.horas}` : this.horas;
        const mm = this.minutos < 10 ? `0${ this.minutos}` : this.minutos;
        const ss = this.segundos < 10 ? `0${this.segundos}` : this.segundos;
	return `${hh}:${mm}:${ss}`;
    }

    // Función para que el reloj tenga un comportamiento normal
    iniciar(p_repeticiones=8) {
        let contador=0 ;
        const intervalId = setInterval(() => {
            contador++;
            if(contador==p_repeticiones) {
                clearInterval(intervalId);
            }
            this.avanzar();
            console.log(this.mostrarTiempo()+" ("+contador+")");
        }, 1000);
    }
}

const newReloj = new Reloj(14,59,58);
newReloj.iniciar();
//newReloj.establecerTiempo(22,2, 55);
//console.log(newReloj.mostrarTiempo());

/* 
const newReloj2= new Reloj(19,58,58);
newReloj2.iniciar();
const newReloj3= new Reloj(5,58,58);
newReloj3.iniciar();
*/
