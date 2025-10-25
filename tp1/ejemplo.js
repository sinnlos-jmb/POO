class Pelicula {
    #calificacion = null;

    constructor(titulo, director, calificacion) {
        this.titulo = titulo;
        this.director = director;
        this.#calificacion=calificacion;
    }

    get_nombre_pelicula() {
        return this.titulo;

    }
      
    obtener_calificacion(p_user) { // p_user = objeto de la clase usuario
    if (p_user.getCategoria()!=0){
	     return this.#calificacion;
	     }
	else {
		return "no tiene acceso a la calificación de la pelicula";
		}
    }

    obtener_calificacion() { 
	     return "la calificion de la pelicula: "+this.titulo+" es: "+this.#calificacion;
    	}    
    }

  // demostracion
  const pel1=new Pelicula("matrix", "jones", "nueve");
  console.log(pel1.obtener_calificacion());
  //console.log(pel1.#calificacion);

  