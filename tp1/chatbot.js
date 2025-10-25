/*
9️⃣ Ejercicio: Sistema de Chatbot
--------------------------------------
📌 Objetivo: Implementar un chatbot simple usando POO.
🔹 Tarea: Crear una clase base `Chatbot`.
   - Subclases: `BotDeSoporte`, `BotDelClima`, `BotDeProgramación`.
   - Cada subclase responde de manera diferente según la entrada del usuario.
*/

// Clase base para todos los chatbots
class Chatbot {
  constructor(nombre) {
    this.nombre = nombre;
    this.historial = [];
  }

  // Método para procesar una entrada del usuario
  procesarMensaje(mensaje) {
    const respuesta = this.generarRespuesta(mensaje);
    this.guardarEnHistorial(mensaje, respuesta);
    return respuesta;
  }

  // Método que debe ser implementado por las subclases
  generarRespuesta(mensaje) {
    return `Soy un chatbot básico. No entiendo específicamente tu mensaje: "${mensaje}"`;
  }

  // Método para guardar la conversación
  guardarEnHistorial(mensaje, respuesta) {
    const tiempo = new Date().toLocaleTimeString();
    this.historial.push({
      tiempo,
      usuario: mensaje,
      bot: respuesta
    });
  }

  // Método para obtener el historial de conversación
  obtenerHistorial() {
    return this.historial;
  }

  // Método para presentarse
  saludar() {
    return `Hola, soy ${this.nombre}. ¿En qué puedo ayudarte?`;
  }

  // Método para despedirse
  despedirse() {
    return `¡Hasta pronto! Ha sido un placer ayudarte.`;
  }
}




// Chatbot especializado en soporte técnico
class BotDeSoporte extends Chatbot {
  constructor(nombre) {
    super(nombre);
    this.problemasFrecuentes = {
      "contraseña": "Para restablecer tu contraseña, ve al menú 'Configuración' y selecciona 'Cambiar contraseña'.",
      "conexión": "Si tienes problemas de conexión, intenta reiniciar tu router o verifica que tu cable de red esté conectado correctamente.",
      "lento": "Si tu sistema está lento, intenta cerrar aplicaciones que no estés usando o reiniciar tu dispositivo.",
      "error": "Proporciona el código de error específico para que pueda ayudarte mejor.",
      "actualizar": "Para actualizar el software, ve a 'Configuración > Sistema > Actualización de software'."
    };
  }

  generarRespuesta(mensaje) {
    mensaje = mensaje.toLowerCase();
    
    // Verificar tipo de mensaje
    if (this.esSaludo(mensaje)) {
      	return `¡Hola! Soy ${this.nombre}, tu asistente de soporte técnico. ¿Cuál es el problema que estás experimentando?`;
	    }
    else if (this.esDespedida(mensaje)) {
      return this.despedirse();
    }

// Buscar palabras clave relacionadas con problemas comunes
let palabrasClave = Object.keys(this.problemasFrecuentes); // Obtiene todas las palabras clave

for (let i = 0; i < palabrasClave.length; i++) {
  let palabra = palabrasClave[i];
  
  //mensaje="como cambiar la contraseña"
  // Comprobar si el mensaje contiene la palabra clave actual. Si encontramos la palabra clave, devolver la solución
  if (mensaje.indexOf(palabra) !== -1) {
    let solucion = this.problemasFrecuentes[palabra];
    return solucion;
  	}
}

    // Si ninguna palabra clave coincide
    return "No he podido identificar tu problema. Por favor, ¿podrías proporcionar más detalles o especificar si es un problema de contraseña, conexión, rendimiento, actualización o si tienes algún código de error?";
  }

  esSaludo(mensaje) {
    const saludos = ["hola", "buenos días", "buenas tardes", "buenas noches", "saludos"];
    // Comprobar si el mensaje contiene algún saludo
    let contieneSaludo = false;

    for (let i = 0; i < saludos.length; i++) {
      let saludo = saludos[i];
      
      if (mensaje.indexOf(saludo) !== -1) {
        contieneSaludo = true;
        break; // Salimos del bucle porque ya encontramos un saludo
        }
    }

    return contieneSaludo;
  }

  esDespedida(mensaje) {
    const despedidas = ["adiós", "chau", "hasta luego", "bye", "gracias"];
    //return despedidas.some(despedida => mensaje.includes(despedida));

	let contieneDespedida = false;
	
	for (let i = 0; i < despedidas.length; i++) {
  		let despedida = despedidas[i];
  		
  		if (mensaje.indexOf(despedida) !== -1) {
    		contieneDespedida = true;
    		break;
  			}
		}

return contieneDespedida;
    
  }
}





// Chatbot especializado en información meteorológica
class BotDelClima extends Chatbot {
  constructor(nombre) {
    super(nombre);
    this.ciudades = {
      "buenos aires": { temperatura: "22°C", condicion: "Soleado", humedad: "45%" },
      "barcelona": { temperatura: "24°C", condicion: "Parcialmente nublado", humedad: "60%" },
      "montevideo": { temperatura: "30°C", condicion: "Soleado", humedad: "30%" },
      "san pablo": { temperatura: "18°C", condicion: "Lluvioso", humedad: "75%" },
      "cordoba": { temperatura: "26°C", condicion: "Soleado", humedad: "50%" },
      "mendoza": { temperatura: "23°C", condicion: "Nublado", humedad: "55%" }
    };
  }

  generarRespuesta(mensaje) {
    mensaje = mensaje.toLowerCase();
    
    // Detectar si se está preguntando por el clima en alguna ciudad
    for (const ciudad in this.ciudades) {
      if (mensaje.includes(ciudad)) {
        const datos = this.ciudades[ciudad];
        return `El clima actual en ${ciudad.charAt(0).toUpperCase() + ciudad.slice(1)} es: 
        - Temperatura: ${datos.temperatura}
        - Condición: ${datos.condicion}
        - Humedad: ${datos.humedad}`;
      }
    }

    // Si hay palabras clave relacionadas con el clima pero no se especifica una ciudad
    if (this.esPreguntaDeClima(mensaje)) {
      return "Puedo proporcionarte información sobre el clima en Buenos Aires, Barcelona, Montevideo, San Pablo, Cordoba o Valencia. ¿De qué ciudad quieres saber el clima?";
    }

    // Respuesta por defecto
    return `Soy ${this.nombre}, tu bot del clima. Puedo darte información meteorológica de varias ciudades. ¿De qué ciudad quieres saber el clima?`;
  }

  esPreguntaDeClima(mensaje) {
    const palabrasClima = ["clima", "tiempo", "temperatura", "lluvia", "sol", "nublado", "pronostico", "previsión"];
    //return palabrasClima.some(palabra => mensaje.includes(palabra));
// Comprobar si el mensaje contiene algún saludo
let contieneClima = false;

for (let i = 0; i < palabrasClima.length; i++) {
  let es_clima = palabrasClima[i];
  if (mensaje.indexOf(es_clima) !== -1) {
    contieneClima = true;
    break;
  }
}

return contieneClima;
    
  }
}

// Chatbot especializado en programación
class BotDeProgramacion extends Chatbot {
  constructor(nombre) {
    super(nombre);
    this.lenguajes = {
      "javascript": "JavaScript es un lenguaje de programación interpretado, orientado a objetos, basado en prototipos, imperativo, débilmente tipado y dinámico.",
      "python": "Python es un lenguaje de programación interpretado cuya filosofía hace hincapié en la legibilidad de su código.",
      "java": "Java es un lenguaje de programación y una plataforma informática comercializada por primera vez en 1995 por Sun Microsystems.",
      "c++": "C++ es un lenguaje de programación diseñado en 1979 por Bjarne Stroustrup. La intención de su creación fue extender al lenguaje de programación C.",
      "php": "PHP es un lenguaje de programación de uso general de código del lado del servidor originalmente diseñado para el desarrollo web de contenido dinámico."
    };
    
    this.conceptos = {
      "variable": "Una variable es un espacio en memoria que almacena un valor que puede cambiar durante la ejecución del programa.",
      "función": "Una función es un bloque de código que realiza una tarea específica y puede ser llamado desde diferentes partes del programa.",
      "clase": "Una clase es una plantilla para la creación de objetos que define sus propiedades y comportamientos.",
      "objeto": "Un objeto es una instancia de una clase que tiene estado y comportamiento.",
      "array": "Un array es una estructura de datos que almacena elementos del mismo tipo en posiciones de memoria contiguas.",
      "bucle": "Un bucle es una estructura de control que permite repetir un bloque de código varias veces.",
      "condicional": "Una estructura condicional permite ejecutar diferentes bloques de código según se cumpla o no una condición."
    };
  }

  generarRespuesta(mensaje) {
    mensaje = mensaje.toLowerCase();
    
    // Buscar si se menciona algún lenguaje de programación
    for (const lenguaje in this.lenguajes) {
      if (mensaje.includes(lenguaje)) {
        return this.lenguajes[lenguaje];
      }
    }
    
    // Buscar si se menciona algún concepto de programación
    for (const concepto in this.conceptos) {
      if (mensaje.includes(concepto)) {
        return this.conceptos[concepto];
      }
    }
    
    // Si pregunta por ejemplo de código
    if (mensaje.includes("ejemplo") || mensaje.includes("código")) {
      return this.darEjemploCodigo(mensaje);
    }
    
    // Respuesta por defecto
    return `Soy ${this.nombre}, un bot especializado en programación. Puedo darte información sobre lenguajes como JavaScript, Python, Java, C++ y PHP, o explicar conceptos como variables, funciones, clases, etc. ¿En qué puedo ayudarte?`;
  }
  
  darEjemploCodigo(mensaje) {
    if (mensaje.includes("javascript") || mensaje.includes("js")) {
      return `
Ejemplo de función en JavaScript:

function sumar(a, b) {
  return a + b;
}

console.log(sumar(5, 3)); // Imprime: 8
`;
    } else if (mensaje.includes("python")) {
      return `
Ejemplo de función en Python:

def sumar(a, b):
  return a + b

print(sumar(5, 3)) # Imprime: 8
`;
    } else if (mensaje.includes("java")) {
      return `
Ejemplo de función en Java:

public int sumar(int a, int b) {
  return a + b;
}

// Uso: int resultado = sumar(5, 3); // resultado = 8
`;
    } else {
      return "Por favor, especifica en qué lenguaje quieres ver un ejemplo (JavaScript, Python, Java, etc.).";
    }
  }
}



// Clase para gestionar múltiples chatbots
class SistemaDeChatbots {
  constructor() {
    this.bots = {}; //this.bots es un objeto que actúa como un mapa o diccionario (podría usarse un array también), donde cada "tipo" de bot (como "soporte" o "clima") es una clave que apunta a su respectiva instancia de bot
  }

  agregarBot(tipo, bot) {
    this.bots[tipo] = bot; // agrego una entrada en el objeto bots: {tipo: bot}, en nuestro ejemplo: {"soporte": botSoporte, "clima": botClima}
    }

  obtenerBot(tipo) {
    return this.bots[tipo];
  }

  procesarMensaje(tipo, mensaje) {
    const bot = this.bots[tipo];
    if (bot) {
      return bot.procesarMensaje(mensaje);
    }
    return "Bot no encontrado. Por favor, utiliza un tipo de bot válido.";
  }

  listarBots() {
    return Object.keys(this.bots);
  }
}




// Demostración de uso


  // Crear el sistema de chatbots
  const sistema = new SistemaDeChatbots();
  
  // Crear instancias de diferentes tipos de bots
  const botSoporte = new BotDeSoporte("TechHelp");
 // const botClima = new BotDelClima("ClimaBot");
 // const botProgramacion = new BotDeProgramacion("CodeMaster");


  
  // Agregar los bots al sistema
  sistema.agregarBot("soporte", botSoporte);
  //sistema.agregarBot("clima", botClima);
  //sistema.agregarBot("programacion", botProgramacion);
  
  // Ejemplos de uso
  console.log("=== Bot de Soporte ===");
  console.log("Usuario: Hola, tengo un problema");
  console.log("Bot:", sistema.procesarMensaje("soporte", "Hola, tengo un problema"));

  console.log("Usuario: Mi computadora está muy lenta");
  console.log("Bot:", sistema.procesarMensaje("soporte", "Mi computador está muy lento"));

  console.log("Usuario: qué dia es hoy?");
  console.log("Bot:", sistema.procesarMensaje("soporte", "qué dia es hoy"));


  console.log("Usuario: Gracias por la ayuda");
  console.log("Bot:", sistema.procesarMensaje("soporte", "Gracias por la ayuda"));

  
/*
  console.log("\n=== Bot del Clima ===");
  console.log("Usuario: ¿Cuál es el clima hoy?");
  console.log("Bot:", sistema.procesarMensaje("clima", "¿Cuál es el clima hoy?"));
  console.log("Usuario: ¿Qué temperatura hace en Mendoza?");
  console.log("Bot:", sistema.procesarMensaje("clima", "¿Qué temperatura hace en Mendoza?"));
  
  console.log("\n=== Bot de Programación ===");
  console.log("Usuario: Háblame sobre JavaScript");
  console.log("Bot:", sistema.procesarMensaje("programacion", "Háblame sobre JavaScript"));
  console.log("Usuario: ¿Qué es una variable?");
  console.log("Bot:", sistema.procesarMensaje("programacion", "¿Qué es una variable?"));
  console.log("Usuario: Dame un ejemplo de código en Python");
  console.log("Bot:", sistema.procesarMensaje("programacion", "Dame un ejemplo de código en Python"));

*/
  // Mostrar historial de conversación del bot de soporte
  console.log("\n=== Historial del Bot de Soporte ===");
  console.log(botSoporte.obtenerHistorial());  //json = javascript object notation
//  console.log("\n=== Historial del Bot de Clima ===");
//

