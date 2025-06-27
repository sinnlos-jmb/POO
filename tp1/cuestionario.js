/*
10. Ejercicio: Sistema de Cuestionario en Línea
--------------------------------------
📌 Objetivo: Crear un sistema de cuestionario interactivo.
🔹 Tarea: Crear una clase `Cuestionario` con:
   - Una lista de objetos `Pregunta`.
   - Un método para `iniciarCuestionario()` y evaluar las respuestas del usuario.
   - Un método para mostrar la puntuación final.
*/

class Cuestionario {

	constructor (materia) {
		this.materia=materia;
		this.puntaje=null;
		this.vec_preguntas=[]; //multiple choice
        this.vec_pesos=[];//1pto, 2ptos, etc. 
		}


	addPregunta(o_pregunta, peso) {
		this.vec_preguntas.push(o_pregunta);
		this.vec_pesos.push(peso);
		}
		
	getPreguntas () {
		return [...this.vec_preguntas]; //copia del array con las preguntas para que alumno responda
		}

    mostrarPreguntas () {
        let rta="", i=0;
        for (; i<this.vec_preguntas.length;i++) {
            rta+=this.vec_preguntas[i].getInfo()+"\n";
            }
        if (i>0) {
            return rta;
        }
        return "no hay respuestas cargadas.";

    }
    
    getPuntaje () {
        return this.puntaje==null? "no hay nota cargada.":this.puntaje;

    }
	
	setRespuestas (vec_respuestas) {
		let puntaje_asignado=0;
        console.log("array de pesos: "+this.vec_pesos);
        for (let i=0; i<vec_respuestas.length; i++)  {
            if (vec_respuestas[i]===this.vec_preguntas[i].getRespuesta()) {
                puntaje_asignado+=this.vec_pesos[i];
                }
        }
		this.puntaje=puntaje_asignado;
		}
		
	mostrarResultado () {
		//devolver un mensaje con la informacion del cuestionario resuelto
			
		}
	
	

	}



 class Pregunta {
 
 constructor (enunciado, rta) {
 	this.enunciado=enunciado;
    this.respuesta=rta;
 	}
 	
 	setEnunciado (enunciado, rta) {
 		this.enunciado=enunciado;
        this.respuesta=rta;
 		}

    getPregunta () {
        return this; //copia!  string.slice(0); para devolver copia solo los composites datatypes se pasan por referencia
        }
    getEnunciado () {
        return this.enunciado; //copia!
        }
    getRespuesta () {
        return this.respuesta; //copia!
        }
    getInfo () {
        return `Enunciado: ${this.enunciado}.\nRespuesta correcta: ${this.respuesta}.`;
        }

 }


 class Materia { //repo de pregumntas-rtas


 }


 class adminCuestionarios {
  //array con cuestionarios, incluidas en el opcion ver cuestionarios del menu con que interactúa el usuario.
  constructor () {
    this.cuestionarios=[];
  }

  addCuestionario(cuest) {
    this.cuestionarios.push(cuest);
  }

  getCuestionarios(index) {
    return {...this.cuestionarios[index]}; //copia del objeto cuestionario
  }  

  getMenu() {
     //para docente (nueva pregunta en materia, nuevo cuestionario) y para alumno ().
  }

  responderCuestionario (cuest) {
    // iterar por preguntas, preguntando enunciado y almacenando rtas
    // corrijo cuestionario
    // usuario debe invocar cuest1.getInfo() para enterarse de puntaje y rtas ok-ko.

  }
 }

 
 let cuest1=new Cuestionario ("historia");
 const pg1=new Pregunta("¿dónde nació san martin?\n1). cordoba\n2).mendoza\n3).corrientes?", 3);
 const pg2=new Pregunta("¿dónde nació santiando de liniers?\n1). españa\n2).mendoza\n3).buenos aires?", 1);
 //agregar clase materia (nombre, array de preguntas y respuestas con puntaje)
 cuest1.addPregunta(pg1, 5);
 cuest1.addPregunta(pg2, 2);
 console.log(cuest1.mostrarPreguntas());
 console.log(cuest1.getPuntaje());
 let vec_pregs=cuest1.getPreguntas();
 for (let i=0; i<vec_pregs.length;i++) {
        vec_pregs[i]=Math.round(Math.random(10)*10);
        }
 cuest1.setRespuestas(vec_pregs);
 console.log("respuestas a las preguntas: "+vec_pregs);
 console.log(cuest1.getPuntaje());
 