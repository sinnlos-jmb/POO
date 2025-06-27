class Libro {
  #calificaciones;

  constructor(id, titulo, autor, año, editorial, isbn="") {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor; // Objeto de tipo Autor
    this.año = año;
    this.editorial = editorial;
    this.isbn = isbn;
    this.categorias = [];
    this.disponible = true;
    this.ubicacion=null;
    this.fechaUltimoPrestamo = null;
    this.prestamosCount = 0;
    this.#calificaciones = ["valor por defecto"]; 
    
  }
  
  getInfo() {
  	return `Titulo: ${this.titulo}, Autor: ${this.autor}, Año: ${this.año} `;
  	}

  getCalificaciones () {
    return [...this.#calificaciones];
  }

  addCalificacion (p_calif) {
    this.#calificaciones.push(p_calif);
    }

}



class Biblioteca {

 #registro_libros;
 constructor (nombre, direccion, celular) {
 	this.nombre=nombre;
 	this.direccion=direccion;
 	this.celular=celular;
	this.#registro_libros=[];
 	}

 listarLibros () {
 	return [...this.#registro_libros];   //spread operator
 	//return this.#registro_libros;
 	}

 agregarLibro (p_libro) {
 	try {
        this.#registro_libros.push(p_libro);
        }
    catch (er) {console.log("error al agregar libror: "+er.toString());}
        console.log("el libro se agregó correctamente");
 
 	}

}

let libro1=new Libro ("112", "La ciudad y los perros", "Vargas LLosa", "1966", "editorial 1"); //id, titulo, autor, año, editorial, isbn
let libro2=new Libro ("113", "Pantaleón y las visitadoras", "Vargas LLosa", "1973", "editorial 1"); //id, titulo, autor, año, editorial, isbn
let libro3=new Libro ("114", "Lituma en los Andes", "Vargas LLosa", "1993", "editorial 1"); //id, titulo, autor, año, editorial, isbn
let libro4=new Libro ("115", "Cinco esquinas", "Vargas LLosa", "2016", "editorial 1"); //id, titulo, autor, año, editorial, isbn
let biblio1=new Biblioteca ("Biblioteca Rojas", "Paso 3332", "1135443345");

biblio1.agregarLibro (libro1);
biblio1.agregarLibro (libro2);
biblio1.agregarLibro (libro3);
biblio1.agregarLibro (libro4);

libro1.autor="Garcia Marquez";  // modificar el atributo autor de un libro, debería hacerse siempre por un metodo de la clase.
libro1.getInfo();


let vec_reg_libros=biblio1.listarLibros();

for (let i=0; i<vec_reg_libros.length; i++) {
  console.log(vec_reg_libros[i].getInfo());
  }

libro1.calificaciones="1 estrella";  //libro1.calificaciones queda indefinido sin dar error
//console.log(libro1.#calificaciones[0]);
//libro1.#calificaiones.push("segunda calificacion");

libro1.addCalificacion("segunda clasif");
let vec_califs=libro1.getCalificaciones();

for (let i=0; i<vec_califs.length;i++) {
    console.log(vec_califs[i]);
    }



let vec_calificaciones=libro1.getCalificaciones();
console.log("calificion: "+vec_calificaciones[0]);
