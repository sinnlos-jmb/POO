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
// Parsea cuerpos de solicitud JSON entrantes
app.use(express.json());

// **IMPORTANTE**: Reemplaza con tu clave de API real de Gemini.
const GEMINI_API_KEY =process.env.key_gem;

// Define una ruta para manejar la llamada a la API de Gemini
app.get('/ask-gemini', async (req, res) => {
    // Configura los encabezados para Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    //res.setHeader('X-Accel-Buffering', 'no'); // Deshabilita el buffering para nginx/apache

    try {
        const userPrompt = req.body.prompt;

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

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;

        // MODIFICACIÓN CLAVE: Aquí es donde nos aseguramos de que se llame a nodeFetch
        console.log('>>>> DEBUG: Realizando llamada a la API de Gemini con nodeFetch...'); 
        const response = await nodeFetch(apiUrl, { // <--- ¡AQUÍ ESTÁ EL CAMBIO IMPORTANTE!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // --- INICIO DE DEPURACIÓN ---
        console.log('>>>> DEBUG: Respuesta recibida de nodeFetch.');
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
        // --- FIN DE DEPURACIÓN ---

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de la API de Gemini:', errorData);
            res.write(`event: error\ndata: ${JSON.stringify({ error: `La API de Gemini respondió con estado ${response.status}: ${JSON.stringify(errorData)}` })}\n\n`);
            return res.end();
        }

        // Lee el cuerpo de la respuesta de la API de Gemini como un stream
        const reader = response.body.getReader(); // Esta línea ahora debería funcionar
        const decoder = new TextDecoder('utf-8');
        let accumulatedResponse = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            accumulatedResponse += decoder.decode(value, { stream: true });

            const lines = accumulatedResponse.split('\n');
            accumulatedResponse = lines.pop();

            for (const line of lines) {
                if (line.trim() === '') continue;

                try {
                    const chunk = JSON.parse(line);
                    if (chunk.candidates && chunk.candidates.length > 0 &&
                        chunk.candidates[0].content && chunk.candidates[0].content.parts &&
                        chunk.candidates[0].content.parts.length > 0) {
                        const partialText = chunk.candidates[0].content.parts[0].text;
                        res.write(`data: ${partialText}\n\n`);
                    }
                } catch (parseError) {
                    accumulatedResponse = line + '\n' + accumulatedResponse;
                    console.warn('Fragmento JSON incompleto o error de parseo, se intentará con el siguiente fragmento:', parseError);
                }
            }
        }

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

        res.write('event: end\ndata: end_of_stream\n\n');
        res.end();

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
