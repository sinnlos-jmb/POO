/*
5️⃣ Ejercicio: Videojuego de Personajes
--------------------------------------
📌 Objetivo: Combinar herencia, encapsulación y composición en un entorno interactivo.
🔹 Tareas:
   - Clase `Personaje` con atributos encapsulados: `nombre`, `vida`, `nivel`.
   - Subclases: `Guerrero`, `Mago`, `Arquero` (cada una con método especial `atacar()`).
   - Clase `Arma` con atributos (`daño`, `tipo`).
   - Composición: cada personaje puede portar un arma.
   - Clase `Batalla` que enfrenta dos personajes y muestra quién gana.
*/

class Personaje {
   #nombre=null;
   #vida=100;
   #nivel=0;
   armas = [];
   batallas = [];
   
   constructor(nombre="Personaje") {
      this.#nombre = nombre;
   }
   getNombre() { return this.#nombre; }
   getVida() { return this.#vida; }
   getNivel() { return this.#nivel; }
   getInfoPersonaje() {
      return `Personaje: ${this.#nombre} - Nivel: ${this.#nivel} - Vida: ${this.#vida} - Armas: ${JSON.stringify(this.armas)}`;
   }
   subirNivel(puntos) {
      this.#nivel+= parseInt(puntos);
   }
   restarVida(danio) {
      this.#vida = this.#vida - parseInt(danio);
      if (this.#vida < 0) this.#vida = 0;
   }
   sumarVida(puntos) {
      this.#vida += parseInt(puntos);
      if (this.#vida > 100) this.#vida = 100;
   }
   obtenerArma(arma) {
      if (!this.armas.includes(arma)) {
         this.armas.push(arma);
      }
   }
   participaEnBatalla(batalla) {
      this.batallas.push(batalla);
      if (batalla.ganador === this) {
         this.subirNivel(5);
      }
   }
}

class Guerrero extends Personaje {
   constructor(nombre) {
      super(nombre);
   }
   atacar(arma) {
      return arma.getDanio() + 15;            
   }
}

class Mago extends Personaje {
   constructor(nombre) {
      super(nombre);
   }
   atacar(arma) {
      return arma.getDanio() + 10;            
   }
}

class Arquero extends Personaje {
   constructor(nombre) {
      super(nombre);
   }
   atacar(arma) {
      return arma.getDanio() + 3;            
   }
}

class Arma {
   constructor(nombre, danio, tipo) {
      this.nombre = nombre;
      this.danio = danio;
      this.tipo = tipo;
   }
   getDanio() {
      return this.danio;
   }
   getInfoArma() {
      return `Arma: ${this.nombre} - Tipo: ${this.tipo} - Daño: ${this.danio}`
   }
}

class Batalla {
   constructor(nombre, personajes) {
      this.nombre = nombre;
      this.integrantes = personajes;
   }
   iniciarBatalla() {
      const participante1 = this.integrantes[0];
      const participante2 = this.integrantes[1];

      const arma1 = participante1.armas[0];
      const arma2 = participante2.armas[0];
      
      participante2.restarVida(participante1.atacar(arma1));
      participante1.restarVida(participante2.atacar(arma2));

      if (participante1.getVida() > participante2.getVida()) {
         this.ganador = participante1;
         this.perdedor = participante2;
      } else if (participante2.getVida() > participante1.getVida()) {
         this.ganador = participante2;
         this.perdedor = participante1;
      } else {
         this.ganador = null; 
         return "La batalla resultó en empate"
      }

      participante1.participaEnBatalla(this);
      participante2.participaEnBatalla(this);

      return this.ganador;
   }
   getGanador() {
      if (this.ganador) {
         return "El ganador es " + this.ganador.getNombre(); 
      } else {
         return "La batalla resultó en empate"
      }
   }
   getPerdedor() {
      if (this.perdedor) {
         return "El perdedor es " + this.perdedor.getNombre();
      } else {
         return "La batalla resultó en empate"
      }
   }
}

const espada = new Arma("Espada", 10, "corte");
const varita = new Arma("Varita", 5, "magia");

const g1 = new Guerrero("Conan");
const m1 = new Mago("Merlín");

g1.obtenerArma(espada);
m1.obtenerArma(varita);

console.log(g1.getInfoPersonaje());
console.log(m1.getInfoPersonaje());

const batalla = new Batalla("Duelo legendario", [g1, m1]);
batalla.iniciarBatalla();

console.log(g1.getInfoPersonaje());
console.log(m1.getInfoPersonaje());

console.log(batalla.getGanador());