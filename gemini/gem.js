// Importa módulos usando la sintaxis ES Modules
import express from 'express';
require('dotenv').config()
import { GoogleGenAI } from '@google/genai'; // Importar el SDK
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const GEMINI_API_KEY =process.env.key_gem;

// Inicializa el SDK de Google Generative AI
const genAI = new GoogleGenAI(GEMINI_API_KEY);




app.post('/ask-gemini', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        const temperature = req.body.temperature !== undefined ? parseFloat(req.body.temperature) : 0.3;
        const llm = req.body.llm !== undefined ? req.body.llm : "models/gemini-2.5-flash";
        const model = genAI.getGenerativeModel({ model: llm }); //gemma-3n-e4b-it  gemma-3-27b-it  gemini-2.5-pro  gemini-2.0-flash 


        if (!userPrompt) {
            return res.status(400).json({ error: 'El prompt es requerido.' });
        }

        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: userPrompt }]
            }],
            // CAMBIO CLAVE: Añade la configuración de generación, incluyendo la temperatura
            generationConfig: {
                temperature: temperature, // Controla la aleatoriedad de la respuesta (0.0 a 1.0)
                // Otros parámetros de generación que podrías añadir:
                // maxOutputTokens: 800,
                // topP: 0.95,
                // topK: 40
            },
        };

        console.log('>>>> DEBUG SERVER: Realizando llamada a la API de Gemini (no-streaming)...\nmodel: '+llm+"\ntemp: "+temperature);
        const result = await model.generateContent(payload);
        const responseText = result.response.text();

        console.log('>>>> DEBUG SERVER: Respuesta completa de Gemini recibida y enviando al cliente.');
        // Envía la respuesta completa como JSON al cliente
        res.json({ response: responseText });

    } catch (error) {
        console.error('Error del servidor durante la llamada a la API de Gemini:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud.', details: error.message });
    }
});

// Inicia el servidor y escucha en el puerto definido
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
