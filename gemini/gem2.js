// server.js
// Importa módulos usando la sintaxis ES Modules
import express from 'express';
require('dotenv').config()
//import fetch from 'node-fetch'; // node-fetch se importa como un módulo ES
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
// Permite que tu aplicación cliente haga solicitudes.
app.use((req, res, next) => {
    // Permite solicitudes desde cualquier origen. Para producción, podrías
    // reemplazar '*' con tu origen de cliente específico (ej. 'http://localhost:8080').
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Permite métodos HTTP específicos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Permite que se envíen encabezados específicos por el cliente
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Permite que se envíen credenciales (como cookies, encabezados de autorización) con las solicitudes
    // Si se establece en true, Access-Control-Allow-Origin no puede ser '*'. Necesitarías
    // especificar el origen exacto si usas credenciales.
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Maneja las solicitudes preflight (método OPTIONS)
    // Los navegadores envían solicitudes preflight para verificar si la solicitud real está permitida.
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Responde con 200 OK para preflight
    }
    next(); // Pasa el control al siguiente middleware o manejador de ruta
});

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Parsea cuerpos de solicitud JSON entrantes
app.use(express.json());

// **IMPORTANTE**: Reemplaza con tu clave de API real de Gemini.
const GEMINI_API_KEY =process.env.key_gem;

// Define una ruta para manejar la llamada a la API de Gemini
app.post('/ask-gemini', async (req, res) => {
    // Configura los encabezados para Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Deshabilita el buffering para nginx/apache

    try {
        const userPrompt = req.body.prompt;

        if (!userPrompt) {
            // Envía un evento de error al cliente y cierra la conexión
            res.write(`event: error\ndata: ${JSON.stringify({ error: 'El prompt es requerido.' })}\n\n`);
            return res.end();
        }

        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: userPrompt }]
            }]
        };

        // Utiliza el modelo gemini-2.0-flash para mejor rendimiento y menor costo.
        // Si necesitas un modelo más potente, puedes cambiarlo (ej. gemini-1.5-pro, gemini-1.5-flash).
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;
console.log('>>>> DEBUG: Realizando llamada a la API de Gemini...');

        // Realiza la llamada a la API de Gemini en modo streaming
        const response = await nodeFetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('>>>> DEBUG: Respuesta recibida de fetch.');
        console.log('>>>> DEBUG: Response status:', response.status);
        console.log('>>>> DEBUG: Is response.ok:', response.ok);
        console.log('>>>> DEBUG: Type of response.body:', typeof response.body);

        // Verifica si response.body es un Stream.Readable de Node.js antiguo
        if (response.body && typeof response.body.pipe === 'function') {
            console.log('>>>> DEBUG: response.body es probablemente un Node.js Stream.Readable (antiguo).');
        } else {
            console.log('>>>> DEBUG: response.body NO es un Node.js Stream.Readable (antiguo).');
        }

            // Verifica si response.body es una instancia de Web Streams ReadableStream
        try {
            if (typeof ReadableStream !== 'undefined' && response.body instanceof ReadableStream) {
                console.log('>>>> DEBUG: response.body es una instancia de Web Streams ReadableStream.');
            } else {
                console.log('>>>> DEBUG: response.body NO es una instancia de Web Streams ReadableStream o ReadableStream no está definida.');
            }
        } catch (e) {
            console.log('>>>> DEBUG: Error al verificar la instancia de ReadableStream:', e.message);
        }
        // Muestra las propiedades del prototipo de response.body para ver sus métodos
        console.log('>>>> DEBUG: Propiedades de response.body:', Object.getOwnPropertyNames(Object.getPrototypeOf(response.body || {})));
        // --- FIN D

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de la API de Gemini:', errorData);
            res.write(`event: error\ndata: ${JSON.stringify({ error: `La API de Gemini respondió con estado ${response.status}: ${JSON.stringify(errorData)}` })}\n\n`);
            return res.end();
        }

        // Lee el cuerpo de la respuesta de la API de Gemini como un stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedResponse = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Decodifica el chunk de datos y lo añade a la respuesta acumulada
            accumulatedResponse += decoder.decode(value, { stream: true });

            // Procesa cada línea como un posible objeto JSON.
            // La API de Gemini puede enviar múltiples objetos JSON separados por nuevas líneas en un solo chunk.
            const lines = accumulatedResponse.split('\n');
            // Mantén la última línea si está incompleta para el próximo chunk
            accumulatedResponse = lines.pop();

            for (const line of lines) {
                if (line.trim() === '') continue; // Ignora líneas vacías

                try {
                    const chunk = JSON.parse(line);
                    // Asegúrate de que la estructura de la respuesta sea la esperada
                    if (chunk.candidates && chunk.candidates.length > 0 &&
                        chunk.candidates[0].content && chunk.candidates[0].content.parts &&
                        chunk.candidates[0].content.parts.length > 0) {
                        const partialText = chunk.candidates[0].content.parts[0].text;
                        // Envía el fragmento de texto parcial al cliente como un evento SSE
                        res.write(`data: ${partialText}\n\n`);
                    }
                } catch (parseError) {
                    // Si falla el parseo, probablemente es un objeto JSON incompleto.
                    // Vuelve a añadirlo al acumulador para el siguiente chunk para intentar parsearlo después.
                    accumulatedResponse = line + '\n' + accumulatedResponse;
                    console.warn('Fragmento JSON incompleto o error de parseo, se intentará con el siguiente fragmento:', parseError);
                }
            }
        }

        // Después de que el stream de Gemini ha terminado, comprueba si queda algún dato acumulado
        // Esto es para asegurar que cualquier JSON incompleto al final del stream sea procesado
        if (accumulatedResponse.trim() !== '') {
            try {
                const chunk = JSON.parse(accumulatedResponse.trim());
                if (chunk.candidates && chunk.candidates.length > 0 &&
                    chunk.candidates[0].content && chunk.candidates[0].content.parts &&
                    chunk.candidates[0].content.parts.length > 0) {
                    const partialText = chunk.candidates[0].content.parts[0].text;
                    res.write(`data: ${partialText}\n\n`);
                }
            } catch (parseError) {
                console.error('Los datos acumulados finales no pudieron ser parseados:', parseError, 'Datos:', accumulatedResponse);
            }
        }

        // Después de que el stream de Gemini ha terminado, envía un evento de fin al cliente
        res.write('event: end\ndata: end_of_stream\n\n');
        res.end(); // Cierra la conexión SSE con el cliente

    } catch (error) {
        console.error('Error del servidor durante la llamada a la API de Gemini:', error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Ocurrió un error al procesar tu solicitud.', details: error.message })}\n\n`);
        res.end();
    }
});

// Inicia el servidor y escucha en el puerto definido
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
