// server.js
// Importa módulos usando la sintaxis ES Modules
import express from 'express';
require('dotenv').config()
// Renombramos la importación para asegurar que usamos el fetch de node-fetch
import nodeFetch from 'node-fetch'; 
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para __dirname en ES Modules

// Determina __dirname y __filename en un entorno ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa la aplicación Express
const app = express();
const port = 3060;

// Middleware para habilitar CORS para todas las rutas.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Parsea cuerpos de solicitud JSON entrantes (aún útil para otras rutas si las hubiera)
//app.use(express.json());

// **IMPORTANTE**: Reemplaza con tu clave de API real de Gemini.
const GEMINI_API_KEY =process.env.key_gem;

/**
 * Función para extraer y parsear un único objeto JSON de una cadena de texto.
 * Utiliza un contador de llaves para manejar objetos JSON anidados y concatenados.
 * Es más robusta para encontrar el inicio de un objeto JSON y maneja comillas escapadas.
 * @param {string} text La cadena de texto de la que intentar extraer JSON.
 * @returns {{parsed: object, processedLength: number}|null} Un objeto con el JSON parseado
 * y la longitud de la cadena procesada, o null si no se encuentra un objeto completo.
 */
function extractAndParseJsonObject(text) {
    let braceCount = 0;
    let inString = false;
    let startIndex = -1; // Índice del primer '{' encontrado para el objeto actual
    
    // Busca el primer '{' para iniciar el escaneo de un nuevo objeto
    for (let i = 0; i < text.length; i++) {
        // Ignora cualquier carácter no JSON antes de un '{'
        if (text[i] === '{') {
            startIndex = i;
            braceCount++; // Contar la primera llave abierta
            break;
        }
    }

    if (startIndex === -1) {
        return null; // No se encontró ningún '{' en el texto
    }

    // Ahora escanea desde el 'startIndex + 1' (después de la primera '{') para encontrar el '}' balanceado
    for (let i = startIndex + 1; i < text.length; i++) {
        const char = text[i];

        if (char === '"' && (i === 0 || text[i-1] !== '\\')) { // Comillas que no son escapadas
            inString = !inString;
        } else if (!inString) {
            if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
            }
        }

        // Si las llaves están balanceadas y encontramos un '}' que cierra un objeto
        if (braceCount === 0 && char === '}') {
            const jsonCandidate = text.substring(startIndex, i + 1);
            try {
                const parsed = JSON.parse(jsonCandidate);
                return { parsed, processedLength: i + 1 };
            } catch (e) {
                // Si falla el parseo de un bloque aparentemente balanceado,
                // significa que la estructura JSON dentro no es válida.
                // Logueamos y avanzamos, descartando este bloque.
                console.warn('>>>> DEBUG SERVER: Falló el parseo de JSON candidato (interno, probablemente corrupto):', jsonCandidate.substring(0, Math.min(jsonCandidate.length, 100)) + '...', 'Error:', e.message);
                return { parsed: null, processedLength: i + 1 }; // Avanzar y descartar este bloque inválido
            }
        }
    }
    
    return null; // No se encontró un objeto JSON completo y balanceado
}


// Define una ruta para manejar la llamada a la API de Gemini
app.get('/ask-gemini', async (req, res) => {
    // Configura los encabezados para Server-Sent Events (SSE)
//    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    //res.setHeader('X-Accel-Buffering', 'no'); // Deshabilita el buffering para nginx/apache

    res.flushHeaders(); 
    console.log('>>>> DEBUG SERVER: Cabeceras SSE enviadas al cliente.');
    // Envía un comentario SSE vacío para asegurar que el stream se inicie de inmediato
    res.write(':\n\n'); 
    console.log('>>>> DEBUG SERVER: Comentario inicial SSE enviado (para keep-alive).');

    // Pequeña pausa para asegurar que el comentario inicial se envía.
    await new Promise(resolve => setTimeout(resolve, 10)); 

    // Añadir listener para depurar cuando la conexión se cierra desde el servidor
    req.on('close', () => {
        console.log('>>>> DEBUG SERVER: Conexión con el cliente cerrada inesperadamente.');
    });

    try {
        const userPrompt = req.query.prompt;

        if (!userPrompt) {
            res.write(`event: error\ndata: ${JSON.stringify({ error: 'El prompt es requerido.' })}\n\n`);
            return res.end();
        }

        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: userPrompt }]
            }]
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;

        console.log('>>>> DEBUG SERVER: Realizando llamada a la API de Gemini con nodeFetch - Streaming con Data Events...'); 
        const response = await nodeFetch(apiUrl, {
            method: 'POST', // La llamada a la API de Gemini sigue siendo POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de la API de Gemini:', errorData);
            res.write(`event: error\ndata: ${JSON.stringify({ error: `La API de Gemini respondió con estado ${response.status}: ${JSON.stringify(errorData)}` })}\n\n`);
            return res.end();
        }

        const decoder = new TextDecoder('utf-8');
        let accumulatedData = ''; 

        response.body.on('data', (chunk) => {
            const decodedChunk = decoder.decode(chunk, { stream: true });
            accumulatedData += decodedChunk;

            // Procesar datos acumulados para extraer objetos JSON
            while (true) {
                const result = extractAndParseJsonObject(accumulatedData);
                
                if (result && result.parsed) {
                    const parsedChunk = result.parsed;
                    if (parsedChunk.candidates && parsedChunk.candidates.length > 0 &&
                        parsedChunk.candidates[0].content && parsedChunk.candidates[0].content.parts &&
                        parsedChunk.candidates[0].content.parts.length > 0) {
                        const partialText = parsedChunk.candidates[0].content.parts[0].text;
                        console.log('>>>> DEBUG SERVER: Enviando chunk de datos al cliente.');
                        res.write(`data: ${partialText}\n\n`);
                    } else if (parsedChunk.usageMetadata) {
                        console.log('>>>> DEBUG SERVER: Usage metadata received:', parsedChunk.usageMetadata);
                    }
                    // Elimina la parte procesada de accumulatedData
                    accumulatedData = accumulatedData.substring(result.processedLength).trimStart();
                } else if (result && !result.parsed && result.processedLength > 0) {
                    // Si extractAndParseJsonObject devolvió null.parsed pero avanzó (processedLength > 0),
                    // significa que encontró un bloque JSON no válido y lo descartó.
                    accumulatedData = accumulatedData.substring(result.processedLength).trimStart();
                } else {
                    // No se encontró un objeto JSON completo en el remanente
                    break; 
                }
            }
        });

        response.body.on('end', async () => {
            // Al final del stream, intenta procesar cualquier dato restante
            // Solo intentamos parsear si aún queda algo que parezca el inicio de un JSON.
            const result = extractAndParseJsonObject(accumulatedData); 
            if (result && result.parsed) {
                const parsedChunk = result.parsed;
                if (parsedChunk.candidates && parsedChunk.candidates.length > 0 &&
                    parsedChunk.candidates[0].content && parsedChunk.candidates[0].content.parts &&
                    parsedChunk.candidates[0].content.parts.length > 0) {
                    const partialText = parsedChunk.candidates[0].content.parts[0].text;
                    res.write(`data: ${partialText}\n\n`);
                } else if (parsedChunk.usageMetadata) {
                     console.log('>>>> DEBUG SERVER: Final Usage metadata received:', parsedChunk.usageMetadata);
                }
            } else if (accumulatedData.trim() !== '') {
                // Si hay datos restantes que no se pudieron parsear como JSON válido,
                // y no es un simple caracter como ']', lo logueamos como error.
                if (accumulatedData.trim() !== ']') { // Ignoramos el ']' final que no es JSON
                    console.error('>>>> DEBUG SERVER: Datos acumulados finales no pudieron ser parseados o no son JSON completo (ignorando `]`):', accumulatedData);
                }
            }
            console.log('>>>> DEBUG SERVER: Fin del stream de Gemini, enviando evento de fin al cliente.');
            //res.write('event: end\ndata: end_of_stream\n\n');
            res.write('event: close\ndata: {"status": "complete"}\n\n'); 
            //res.write(':\n\n'); // keep-alive final opcional
            //isStreamEnded = true; // Marca que el stream ha terminado de nuestro lado
            await new Promise(r => setTimeout(r, 200));  // 100ms de espera
            
            res.end(); 
        });

        response.body.on('error', (streamError) => {
            console.error('Error en el stream de respuesta de Gemini:', streamError);
            res.write(`event: error\ndata: ${JSON.stringify({ error: 'Ocurrió un error en el stream de Gemini.', details: streamError.message })}\n\n`);
            res.end();
        });

    } catch (error) {
        console.error('Error del servidor durante la llamada a la API de Gemini (catch principal):', error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Ocurrió un error al procesar tu solicitud.', details: error.message })}\n\n`);
        res.end();
    }
});


app.get('/prueba-sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Muy importante si usás Nginx

    res.flushHeaders();
    res.write(':\n\n'); // Mantiene viva la conexión

    let count = 0;
    const interval = setInterval(() => {
        count++;
        res.write(`data: Mensaje ${count}\n\n`);
        if (count >= 5) {
            res.write('event: end\ndata: end_of_stream\n\n');
            clearInterval(interval);
            res.end();
        }
    }, 1000);

    req.on('close', () => {
        console.log('>>>> CLIENTE DESCONECTADO');
        clearInterval(interval);
    });
});



// Inicia el servidor y escucha en el puerto definido
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
