class Estudiante {
    #calificaciones
  constructor(p_nombre) {
    this.nombre = p_nombre;
    this.#calificaciones = [];
  }

  //un metodo static pertenece a la clase y no a los objetos que instancias esa clase.
  static calcularPromedio (notas) {  
    let sum=0;
    for (let i=0; i<notas.length; i++) {
      sum+=notas[i];
      console.log(notas[i]);
      }
    return (sum/notas.length).toFixed(2);

  }

  agregarCalificacion(nota) {
    if (nota >= 0 && nota <= 10) { 
      this.#calificaciones.push(nota);
      console.log(`Calificación ${nota} agregada para ${this.nombre}`);
    } else {
      console.log(`La nota ${nota} no es válida. Debe estar entre 0 y 10.`);
    }
  }

 getPromedio() {
  return Estudiante.calcularPromedio (this.#calificaciones);
 }

  // Método para calcular el promedio
  obtenerPromedio() {
    if (this.#calificaciones.length === 0) {
      return 0;
    }
    const suma = this.#calificaciones.reduce((total, nota) => total + nota, 0);
    return suma / this.#calificaciones.length;
  }

  // Método para mostrar la información del estudiante
  mostrarInfo() {
    const promedio = this.obtenerPromedio();
    console.log(`Estudiante: ${this.nombre}`);
    console.log(`Calificaciones: ${this.#calificaciones.join(', ')}`);
    console.log(`Promedio: ${promedio.toFixed(2)}`);
  }

  // Getters
  get_nombre() {
    return this.nombre;
  }

  get_calificaciones() {
    return [...this.#calificaciones]; // spread operator, devuelve una copia del array
  }
}

// Ejemplo de uso
const estudiante1 = new Estudiante("María García");
//estudiante1._nombre="fernando";

estudiante1.agregarCalificacion(8);
estudiante1.agregarCalificacion(9);
estudiante1.agregarCalificacion(7);
estudiante1.agregarCalificacion(10);
//estudiante1.agregarCalificacion(-5); // Nota no válida

//console.log(estudiante1.calcularPromedio([4, 7, 9]));
//console.log(Estudiante.calcularPromedio([10, 3, 8]));

//estudiante1.mostrarInfo();
//const estudiante2 = new Estudiante("María García");
console.log(estudiante1.getPromedio());