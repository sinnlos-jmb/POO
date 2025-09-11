/*
4️⃣ Ejercicio: Sistema de Gestión de Zoológico
--------------------------------------
🔹 Tarea: Crear una clase base `Animal`.
   - Subclases: `León`, `Elefante`, `Mono`.
   - Cada subclase sobrescribe el método `hacerSonido()`.
*/


// Clase Base: Animal
class Animal {

    #especie="";
    constructor (nombre) {
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
    
    constructor(nombre, p_sonido, nom_leon="leon1") {
        super(nombre);
        this.nombre_leon=nom_leon;
        this.nombre=nombre;
        this.sonido = "🦁 ¡Roooaaarrr!"; // Sonido por defecto
        this.manada="ninguna";
    }

    unirse_a_manada(p_nom_manada) {
        this.manada=p_nom_manada;
    } 

    setNombreLeon(p_nombre2) {
        this.nombre_leon=p_nombre2;

    }

    listar_miembros_manada () {

        //procesar miembros de manada y devolver string.
    }

    mostrarInfo() {
        return `🐾 Animal: ${this.nombre} - Sonido: ${this.hacerSonido()} - manada: ${this.manada}, segundo nombre: ${this.nombre_leon}`;
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

class Manada {
    
    constructor (p_nom_manada) {
        this.nombre=p_nom_manada; 
        this.integrantes=[]; 
    }

    add_leon (o_leon) {
        this.integrantes.push(o_leon);
        return "leon agregado a la manada";
    }

    get_cantidad_leones() {

        return this.integrantes.length;
    }

    get_localizacion_integrantes() {
        let rta ={msg:"", gps_leones:[]};
        for (let i=0; i<this.integrantes.length;i++) {
            rta.gps_leones.push({nombre:this.integrantes[i].nombre, gps: "2:3"});
        }
        rta.msg="ok";
    return rta;

    }

    get_info() {

        return `nombre de manada: ${this.nombre} integrantes: ${JSON.stringify(this.integrantes)}`;
    }


    
}


// ✅ Ejemplo de uso
const leon1 = new Leon("Simba");

try {
    const manada1=new Manada("zonax");
    

    }
catch (er) {
    console.log("excepcion al intentar instanciar un objeto de la clase Manada: "+er);
}




manada1.add_leon(leon1);

leon1.unirse_a_manada("manada1"); // metodo duplicado pero mantenemos para no tener que readaptar las clases (agregamos clase manada).

console.log(leon1.mostrarInfo());

leon1.setNombreLeon("segundo nombre cambiado");

console.log(leon1.mostrarInfo());

const leon2= new Leon ("mufassa");
leon2.setSonido("grrrrrrrr  mufassa!!");

leon2.unirse_a_manada("manada1");

console.log(leon2.mostrarInfo());
manada1.add_leon(leon2);

console.log(manada1.get_info());


const elefante1 = new Elefante("Dumbo");
const mono1 = new Mono("George");

const mono2 =new Mono("chita"); //usar let si voy a modificar el valor de la variable
mono2.nombre="juancito";
console.log("nombre cambiado accediendo directamente al atributo"+mono2.getNombre());

//mono2=new Mono("juancito"); //error cuando intento asignar nuevo valor a constante, pero sí puedo modificar valor de atributos mediante metodos, o también directamnte
//mono2=2;
// Mostrar sonidos originales
console.log(leon1.mostrarInfo());
//console.log(elefante1.mostrarInfo());
//console.log(mono1.mostrarInfo());

// Cambiar sonidos dinámicamente con setSonido()
leon1.setSonido("🦁 ¡Grrrrrrr!");
leon1.unirse_a_manada("manada 2");
mono2.setSonido("ruido de mono2");
elefante1.setSonido("🐘 ¡Brrrrrrr!");
//mono1.setSonido("🐵 ¡Eeee Eeee!");




// Mostrar nuevos sonidos
console.log("\n🔄 Sonidos actualizados:");
console.log(leon1.mostrarInfo());
//console.log(elefante1.mostrarInfo());
console.log(mono1.mostrarInfo());
console.log(mono2.mostrarInfo());

console.log(elefante1.mostrarInfo());

/**/
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

const gps_manada=manada1.get_localizacion_integrantes();
console.log("Invoco metodo gps: "+gps_manada.msg);
console.log("ubicacion de integrantes: "+JSON.stringify(gps_manada.gps_leones));
