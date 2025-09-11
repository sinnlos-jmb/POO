class Reloj {
  
  constructor() {
    this.hora = 0;
    this.minutos = 0;
    this.segundos = 0;
  }

  avanzar() {
    if (this.segundos<59) {
        this.segundos++;
    }
    else {
        this.segundos=0;
        if (this.minutos<59){
            this.minutos++;
            }
        else {
            this.minutos=0;
            this.segundos=0;
            this.hora++;
            }
        }
  }

mostrar_hora () {

    return this.hora+":"+this.minutos+":"+this.segundos;
}
}


let reloj1=new Reloj();
console.log(reloj1.mostrar_hora());
for (let i=0;i<7000;i++) {
    reloj1.avanzar(); 
    }
console.log(reloj1.mostrar_hora());
