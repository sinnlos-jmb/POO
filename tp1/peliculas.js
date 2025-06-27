/*2️⃣ Ejercicio: Sistema de Películas
--------------------------------------
📌 Objetivo: Aprender encapsulamiento protegiendo propiedades privadas.
🔹 Tarea: Crear una clase `Película` con:
   - `título`, `director`, `calificación` (1-10).
   - Una propiedad privada `_calificación` y un método `setCalificacion(valor)`.
   - Un método `getInfo()` que muestra los detalles de la película.
*/


class Pelicula {
    // ✅ Declaramos el campo privado antes de usarlo
    #calificacion = null;

    constructor(titulo, director, calificacion) {
        this.titulo = titulo;
        this.director = director;
        this.#setCalificacion(calificacion);
        //this.#calificacion=calificacion;  // debería unicamente permitirse asignar un valor a este atributo privado mediante el metodo setCalificaion(valor)
        // this.calificacion=#calificacion; error
    }

    validarCalificacion(valor) {
        return valor >= 1 && valor <= 10;
        }

    #setCalificacion(valor) {
        if (this.validarCalificacion(valor)) {
            this.#calificacion = valor;
        } else {
            throw new Error("La calificación debe estar entre 1 y 10");
        }
    }

    getCalificacion() {
        return this.#calificacion;
    }

    getInfo() {
        return `Película: ${this.titulo}
Director: ${this.director}
Calificación: ${this.#calificacion}/10`;
    }
}

// ✅ Prueba la clase
const pelicula1 = new Pelicula("Inception", "Christopher Nolan", 9);
console.log(pelicula1.getInfo());
try {
    const pelicula2 = new Pelicula("Titanic", "James Cameron", 11); // ❌ Lanza error
    console.log(pelicula2.getInfo());
    }
catch ( e) {
    console.log("se ha producido un error: "+e.message);}
