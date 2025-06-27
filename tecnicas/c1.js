// EJERCICIO: Combinaciones de amigos en un vehículo SIN RECURSIÓN
// Dado un vehículo de n asientos y n amigos, imprimir todas las formas de sentarlos

// SOLUCIÓN 1: Permutaciones usando algoritmo de Heap (iterativo)
function generarPermutaciones(amigos, asientos) {
    console.log("=== PERMUTACIONES (todos los amigos caben) ===");
    console.log("Amigos:", amigos);
    console.log("Asientos disponibles:", asientos);
    console.log("Todas las combinaciones posibles:");
    console.log("");
    
   let contador = 0, rta="", n = amigos.length;
    

    function permutar(actual, resto) {
        if (resto.length === 0) {
            contador++;
            rta+=contador + ": " + actual.join(", ")+"\n";
            return;
        }

        for (let i = 0; i < resto.length; i++) {
            let nuevoActual = actual.slice(); // copia superficial
            nuevoActual.push(resto[i]);

            let nuevoResto = resto.slice(0, i).concat(resto.slice(i + 1));

            permutar(nuevoActual, nuevoResto);
        }
    }

permutar([], amigos);
console.log (rta+"\ncantidad: "+contador);



}

// SOLUCIÓN 2: Combinaciones usando método iterativo con índices
function generarCombinaciones(amigos, asientos) {
    console.log("=== COMBINACIONES (más amigos que asientos) ===");
    console.log("Amigos:", amigos);
    console.log("Asientos disponibles:", asientos);
    console.log("Combinaciones posibles de", asientos, "amigos:");
    console.log("");
    
    let contador = 0, k_amigos = amigos.length,  k_asientos = asientos, rta="1: ";
    
    // Crear arreglo de índices (cantidad de asientos)
    let indices = [];
    for (let i = 0; i < k_asientos; i++) {
        indices[i] = i;
    }
    
    // primera combinación
    for (let i = 0; i < k_asientos; i++) {
        rta += amigos[indices[i]];
        if (i < k_asientos - 1) {
            rta += ", ";
            }
        else {rta+="\n";}
    }
    contador++;
    
    // Generar el resto de combinaciones
    while (true) {
        let i = k_asientos - 1;// el índice más a la derecha que se puede incrementar
        while (i >= 0 && indices[i] === k_amigos - k_asientos + i) {
            i--; //cuando el indice en la ultima posicion del array de asientos corresponde al ultimo amigo, paso a modificar la ante ultima posicion
            }
        
        if (i < 0) {// si no se encontró tal índice, terminamos
            break;
            }
        
        indices[i]++;
        
        
        for (let j = i + 1; j < k_asientos; j++) {  // actualiza todos los índices a su derecha
            indices[j] = indices[j - 1] + 1;
            }
        
        let temp_rta = "";  // muestra combinación
        for (let k = 0; k < k_asientos; k++) {
            temp_rta += amigos[indices[k]];
            temp_rta+=(k < k_asientos - 1) ? ", ":"\n";
            }
        
        contador++;
        rta+=contador + ": " + temp_rta;
    }
    
    console.log("Total de combinaciones:", contador+"\n"+rta);
    console.log("");
}

// SOLUCIÓN 3: Combinaciones con todas sus permutaciones (iterativo)
function generarCombinacionesConPermutaciones(amigos, asientos) {
    console.log("=== COMBINACIONES CON TODAS LAS PERMUTACIONES ===");
    console.log("Amigos:", amigos);
    console.log("Asientos disponibles:", asientos);
    console.log("Todas las formas de sentar", asientos, "amigos (orden importa):");
    console.log("");
    
    var contadorTotal = 0;
    var n = amigos.length;
    var r = asientos;
    
    // Primero generamos todas las combinaciones
    var todasLasCombinaciones = [];
    var indices = [];
    for (var i = 0; i < r; i++) {
        indices[i] = i;
    }
    
    // Guardar la primera combinación
    var combinacion = [];
    for (var i = 0; i < r; i++) {
        combinacion[i] = amigos[indices[i]];
    }
    todasLasCombinaciones[todasLasCombinaciones.length] = combinacion;
    
    // Generar el resto de combinaciones
    while (true) {
        var i = r - 1;
        while (i >= 0 && indices[i] === n - r + i) {
            i--;
        }
        
        if (i < 0) {
            break;
        }
        
        indices[i]++;
        for (var j = i + 1; j < r; j++) {
            indices[j] = indices[j - 1] + 1;
        }
        
        // Guardar esta combinación
        combinacion = [];
        for (var k = 0; k < r; k++) {
            combinacion[k] = amigos[indices[k]];
        }
        todasLasCombinaciones[todasLasCombinaciones.length] = combinacion;
    }
    
    // Ahora generar todas las permutaciones de cada combinación
    for (var combIdx = 0; combIdx < todasLasCombinaciones.length; combIdx++) {
        var combinacionActual = todasLasCombinaciones[combIdx];
        
        // Crear una copia para permutar
        var arr = [];
        for (var i = 0; i < combinacionActual.length; i++) {
            arr[i] = combinacionActual[i];
        }
        
        // Usar algoritmo de Heap para esta combinación
        var c = [];
        for (var i = 0; i < r; i++) {
            c[i] = 0;
        }
        
        // Mostrar la primera permutación de esta combinación
        contadorTotal++;
        var resultado = "";
        for (var i = 0; i < r; i++) {
            resultado += arr[i];
            if (i < r - 1) {
                resultado += ", ";
            }
        }
        console.log(contadorTotal + ": " + resultado);
        
        // Generar el resto de permutaciones de esta combinación
        var i = 0;
        while (i < r) {
            if (c[i] < i) {
                if (i % 2 === 0) {
                    var temp = arr[0];
                    arr[0] = arr[i];
                    arr[i] = temp;
                } else {
                    var temp = arr[c[i]];
                    arr[c[i]] = arr[i];
                    arr[i] = temp;
                }
                
                contadorTotal++;
                resultado = "";
                for (var j = 0; j < r; j++) {
                    resultado += arr[j];
                    if (j < r - 1) {
                        resultado += ", ";
                    }
                }
                console.log(contadorTotal + ": " + resultado);
                
                c[i]++;
                i = 0;
            } else {
                c[i] = 0;
                i++;
            }
        }
    }
    
    console.log("Total de formas diferentes:", contadorTotal);
    console.log("");
}

// SOLUCIÓN 4: Caso especial - Más asientos que amigos (orden Y posición importan)
function generarUbicacionesEnAsientos(amigos, totalAsientos) {
    console.log("=== UBICACIONES EN ASIENTOS ESPECÍFICOS ===");
    console.log("Amigos:", amigos);
    console.log("Total de asientos:", totalAsientos);
    console.log("Todas las formas de ubicar amigos (orden Y posición importan):");
    console.log("");
    
    var contador = 0;
    var numAmigos = amigos.length;
    
    // Primero, generar todas las permutaciones de los amigos
    var todasLasPermutaciones = [];
    
    // Crear arreglo inicial
    var arr = [];
    for (var i = 0; i < numAmigos; i++) {
        arr[i] = amigos[i];
    }
    
    // Usar algoritmo de Heap para generar todas las permutaciones
    var c = [];
    for (var i = 0; i < numAmigos; i++) {
        c[i] = 0;
    }
    
    // Guardar la primera permutación
    var permutacion = [];
    for (var i = 0; i < numAmigos; i++) {
        permutacion[i] = arr[i];
    }
    todasLasPermutaciones[todasLasPermutaciones.length] = permutacion;
    
    // Generar el resto de permutaciones
    var i = 0;
    while (i < numAmigos) {
        if (c[i] < i) {
            if (i % 2 === 0) {
                var temp = arr[0];
                arr[0] = arr[i];
                arr[i] = temp;
            } else {
                var temp = arr[c[i]];
                arr[c[i]] = arr[i];
                arr[i] = temp;
            }
            
            // Guardar esta permutación
            permutacion = [];
            for (var j = 0; j < numAmigos; j++) {
                permutacion[j] = arr[j];
            }
            todasLasPermutaciones[todasLasPermutaciones.length] = permutacion;
            
            c[i]++;
            i = 0;
        } else {
            c[i] = 0;
            i++;
        }
    }
    
    // Ahora, para cada permutación, generar todas las formas de ubicarla en los asientos
    for (var permIdx = 0; permIdx < todasLasPermutaciones.length; permIdx++) {
        var permutacionActual = todasLasPermutaciones[permIdx];
        
        // Generar todas las combinaciones de asientos donde ubicar esta permutación
        var indicesAsientos = [];
        for (var i = 0; i < numAmigos; i++) {
            indicesAsientos[i] = i;
        }
        
        // Generar la primera combinación de asientos
        var resultado = "";
        for (var i = 0; i < totalAsientos; i++) {
            if (i < numAmigos) {
                resultado += "Asiento " + (indicesAsientos[i] + 1) + ": " + permutacionActual[i];
            } else {
                resultado += "Asiento " + (i + 1) + ": vacío";
            }
            if (i < totalAsientos - 1) {
                resultado += " | ";
            }
        }
        contador++;
        console.log(contador + ": " + resultado);
        
        // Generar el resto de combinaciones de asientos para esta permutación
        while (true) {
            var k = numAmigos - 1;
            while (k >= 0 && indicesAsientos[k] === totalAsientos - numAmigos + k) {
                k--;
            }
            
            if (k < 0) {
                break;
            }
            
            indicesAsientos[k]++;
            for (var j = k + 1; j < numAmigos; j++) {
                indicesAsientos[j] = indicesAsientos[j - 1] + 1;
            }
            
            // Mostrar esta combinación de asientos
            resultado = "";
            for (var i = 0; i < totalAsientos; i++) {
                var ocupado = false;
                var amigoEnEsteAsiento = "";
                
                for (var j = 0; j < numAmigos; j++) {
                    if (indicesAsientos[j] === i) {
                        ocupado = true;
                        amigoEnEsteAsiento = permutacionActual[j];
                        break;
                    }
                }
                
                if (ocupado) {
                    resultado += "Asiento " + (i + 1) + ": " + amigoEnEsteAsiento;
                } else {
                    resultado += "Asiento " + (i + 1) + ": vacío";
                }
                
                if (i < totalAsientos - 1) {
                    resultado += " | ";
                }
            }
            contador++;
            console.log(contador + ": " + resultado);
        }
    }
    
    console.log("Total de ubicaciones diferentes:", contador);
    console.log("");
}

// SOLUCIÓN ALTERNATIVA: Usando contadores binarios para combinaciones
function generarCombinacionesBinario(amigos, asientos) {
    console.log("=== COMBINACIONES USANDO MÉTODO BINARIO ===");
    console.log("Amigos:", amigos);
    console.log("Asientos disponibles:", asientos);
    console.log("Combinaciones usando representación binaria:");
    console.log("");
    
    var contador = 0;
    var n = amigos.length;
    var r = asientos;
    
    // Generar todas las combinaciones usando números binarios
    var totalCombinaciones = 1;
    for (var i = 0; i < n; i++) {
        totalCombinaciones *= 2;
    }
    
    for (var i = 0; i < totalCombinaciones; i++) {
        var bitCount = 0;
        var temp = i;
        
        // Contar bits activados
        while (temp > 0) {
            if (temp % 2 === 1) {
                bitCount++;
            }
            temp = Math.floor(temp / 2);
        }
        
        // Si tiene exactamente r bits activados, es una combinación válida
        if (bitCount === r) {
            var resultado = "";
            var primero = true;
            temp = i;
            
            for (var j = 0; j < n; j++) {
                if (temp % 2 === 1) {
                    if (!primero) {
                        resultado += ", ";
                    }
                    resultado += amigos[j];
                    primero = false;
                }
                temp = Math.floor(temp / 2);
            }
            
            contador++;
            console.log(contador + ": " + resultado);
        }
    }
    
    console.log("Total de combinaciones:", contador);
    console.log("");
}

// FUNCIÓN PRINCIPAL PARA RESOLVER EL EJERCICIO
function resolverEjercicioVehiculo(amigos, asientos) {
    console.log("==========================================");
    console.log("    EJERCICIO: AMIGOS EN EL VEHÍCULO");
    console.log("         (VERSIÓN SIN RECURSIÓN)");
    console.log("==========================================");
    
    if (asientos === amigos.length) {
        // Caso 1: Número de asientos = número de amigos
        generarPermutaciones(amigos, asientos);
    } else if (asientos < amigos.length) {
        // Caso 2: Más amigos que asientos
        console.log("¡Hay más amigos que asientos!");
        console.log("");
        
        // Mostrar combinaciones simples
        generarCombinaciones(amigos, asientos);
        
        // Mostrar método binario (alternativo)
        if (amigos.length <= 10) { // Solo para arreglos pequeños
            generarCombinacionesBinario(amigos, asientos);
        }
        
        // Mostrar todas las formas considerando el orden
        generarCombinacionesConPermutaciones(amigos, asientos);
    } else {
        // Caso 3: Más asientos que amigos
        console.log("Hay más asientos que amigos. Todos los amigos pueden sentarse.");
        console.log("Se considerará el orden de los amigos Y qué asientos ocupan.");
        console.log("");
        
        // Generar todas las formas de ubicar amigos en asientos específicos
        generarUbicacionesEnAsientos(amigos, asientos);
    }
}

// EJEMPLOS DE USO

// Ejemplo 1: Mismo número de amigos y asientos
console.log("EJEMPLO 1: 3 amigos, 3 asientos");
var amigos1 = ["Ana", "Luis", "Carlos"];
resolverEjercicioVehiculo(amigos1, 3);

// Ejemplo 2: Más amigos que asientos (caso del ejercicio)
console.log("EJEMPLO 2: 4 amigos, 2 asientos");
var amigos2 = ["Laura", "Juan", "Pedro", "Maria"];
resolverEjercicioVehiculo(amigos2, 2);

// Ejemplo 3: Más asientos que amigos (orden Y posición importan)
console.log("EJEMPLO 3: 3 amigos, 5 asientos");
var amigos3 = ["Pedro", "Ana", "Luis"];
resolverEjercicioVehiculo(amigos3, 5);

// Ejemplo 4: Caso pequeño para demostrar método binario
console.log("EJEMPLO 4: 4 amigos, 3 asientos");
var amigos4 = ["Pedro", "Ana", "Luis", "Sofia"];
resolverEjercicioVehiculo(amigos4, 3);

// FUNCIONES AUXILIARES

// Función para calcular factorial
function factorial(n) {
    if (n <= 1) return 1;
    var resultado = 1;
    for (var i = 2; i <= n; i++) {
        resultado *= i;
    }
    return resultado;
}

// Función para calcular variaciones V(n,r) = n! / (n-r)!
function calcularVariaciones(n, r) {
    if (r > n) return 0;
    if (r === 0) return 1;
    
    var resultado = 1;
    for (var i = 0; i < r; i++) {
        resultado *= (n - i);
    }
    
    return resultado;
}
// Función para calcular combinaciones C(n,r)
function calcularCombinaciones(n, r) {
    if (r > n) return 0;
    if (r === 0 || r === n) return 1;
    
    var numerador = 1;
    var denominador = 1;
    
    for (var i = 0; i < r; i++) {
        numerador *= (n - i);
        denominador *= (i + 1);
    }
    
    return numerador / denominador;
}

// Función para mostrar información matemática
function mostrarInformacionMatematica(totalAmigos, asientos) {
    console.log("=== INFORMACIÓN MATEMÁTICA ===");
    console.log("Total de amigos:", totalAmigos);
    console.log("Asientos disponibles:", asientos);
    
    if (asientos === totalAmigos) {
        var permutaciones = factorial(totalAmigos);
        console.log("Permutaciones totales:", permutaciones);
        console.log("Fórmula: " + totalAmigos + "! = " + permutaciones);
    } else if (asientos < totalAmigos) {
        var combinaciones = calcularCombinaciones(totalAmigos, asientos);
        var permutaciones = combinaciones * factorial(asientos);
        
        console.log("Combinaciones posibles (sin orden):", combinaciones);
        console.log("Permutaciones totales (con orden):", permutaciones);
        console.log("Fórmula combinaciones: C(" + totalAmigos + "," + asientos + ") = " + combinaciones);
        console.log("Fórmula permutaciones: C(" + totalAmigos + "," + asientos + ") × " + asientos + "! = " + permutaciones);
    } else {
        // Más asientos que amigos
        var variaciones = calcularVariaciones(asientos, totalAmigos);
        console.log("Variaciones totales (orden Y posición importan):", variaciones);
        console.log("Fórmula variaciones: V(" + asientos + "," + totalAmigos + ") = " + asientos + "! / (" + asientos + "-" + totalAmigos + ")! = " + variaciones);
        
        var permutacionesSimples = factorial(totalAmigos);
        console.log("Si solo importara el orden (no la posición):", permutacionesSimples);
    }
    console.log("");
}

// Ejemplo con información matemática
console.log("VERIFICACIÓN MATEMÁTICA:");
mostrarInformacionMatematica(4, 2);

console.log("VERIFICACIÓN MATEMÁTICA - MÁS ASIENTOS:");
mostrarInformacionMatematica(3, 5);

// DEMOSTRACIÓN DE LOS DIFERENTES ALGORITMOS
console.log("=== DEMOSTRACIÓN DE ALGORITMOS DIFERENTES ===");
console.log("Comparando métodos para generar combinaciones:");
console.log("");

var amigosDemo = ["A", "B", "C", "D"];
var asientosDemo = 2;

console.log("Método 1 - Índices iterativos:");
generarCombinaciones(amigosDemo, asientosDemo);

console.log("Método 2 - Representación binaria:");
generarCombinacionesBinario(amigosDemo, asientosDemo);