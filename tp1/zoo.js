/*
4️⃣ Ejercicio: Sistema de Gestión de Zoológico
--------------------------------------
🔹 Tarea: Crear una clase base `Animal`.
   - Subclases: `León`, `Elefante`, `Mono`.
   - Cada subclase sobrescribe el método `hacerSonido()`.
*/


// Clase Base: Animal
class Animal {

    constructor(nombre) {
        this.nombre = nombre;
        this.sonido = "🐾 Sonido de animal genérico..."; // Valor por defecto
     }

    // Método para modificar el sonido del animal
    setSonido(p_sonido) {
        this.sonido = p_sonido;
    }

    setNombre(p_nombre) {
        this.nombre = p_nombre;
    }    

    // Método genérico a ser sobrescrito por las subclases
    hacerSonido() {
        return this.sonido;
    }

    getNombre() {
        return this.nombre;
    }

    // Método común para mostrar la información del animal
    mostrarInfo() {
        return `🐾 Animal: ${this.nombre} - Sonido: ${this.hacerSonido()}`;
    }
}

// Subclase: León
class Leon extends Animal {
    constructor(nombre) {
        super(nombre);
        this.sonido = "🦁 ¡Roooaaarrr!"; // Sonido por defecto
        this.manada="ninguna";
    }

    unirse_a_manada(p_nom_manada) {
        this.manada=p_nom_manada;
    }

    mostrarInfo() {
        return `🐾 Animal: ${this.nombre} - Sonido: ${this.hacerSonido()} - manada: ${this.manada}`;
    }

}

// Subclase: Elefante
class Elefante extends Animal {
    constructor(nombre) {
        super(nombre);
        this.sonido = "🐘 ¡Puuuuuhhh!"; // Sonido por defecto
    }
}

// Subclase: Mono
class Mono extends Animal {
    constructor(nombre) {
        super(nombre);
        this.sonido = "🐵 ¡Ooh Ooh Aah Aah!"; // Sonido por defecto
    }
}



// ✅ Ejemplo de uso
const leon1 = new Leon("Simba");
leon1.unirse_a_manada("manada1");
const elefante1 = new Elefante("Dumbo");
const mono1 = new Mono("George");

const mono2 =new Mono("chita"); //usar let si voy a modificar el valor de la variable
mono2=2;
// Mostrar sonidos originales
console.log(leon1.mostrarInfo());
//console.log(elefante1.mostrarInfo());
//console.log(mono1.mostrarInfo());

// Cambiar sonidos dinámicamente con setSonido()
leon1.setSonido("🦁 ¡Grrrrrrr!");
leon1.unirse_a_manada("manada 2");
mono2.setSonido("ruido de mono2");
//elefante1.setSonido("🐘 ¡Brrrrrrr!");
//mono1.setSonido("🐵 ¡Eeee Eeee!");


// Mostrar nuevos sonidos
console.log("\n🔄 Sonidos actualizados:");
console.log(leon1.mostrarInfo());
//console.log(elefante1.mostrarInfo());
console.log(mono1.mostrarInfo());
console.log(mono2.mostrarInfo());


/*
let animal1=new Animal ("juancito");
console.log (animal1.mostrarInfo());
animal1.setSonido("sonido modificado");
console.log (animal1.hacerSonido());
animal1.setNombre("marcela");
console.log (animal1.getNombre()); 

let animal2=new Animal("roberto");
let vec_animales=[animal1, animal2];
console.log(vec_animales[1].mostrarInfo());
*/

