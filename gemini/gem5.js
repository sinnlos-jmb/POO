import express from 'express';
import 'dotenv/config' //require('dotenv').config()
import cors from 'cors'; 
import { GoogleGenAI } from '@google/genai'; // Updated import for the latest SDK
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para __dirname en ES Modules
// Initialize Express app
const app = express();
const port = process.env.port; // Port for the server to listen on

// Middleware setup
// Enable CORS for all origins, allowing your frontend to connect
app.use(cors());
// Parse JSON bodies for incoming requests
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Initialize GoogleGenAI
const genAI = new GoogleGenAI({
    apiKey: process.env.key_gem,
    apiVersion: 'v1beta' // Using v1beta for broader compatibility
});

// API endpoint to generate content from Gemini LLM
app.post('/generate-content', async (req, res) => {
    // Set response headers for streaming text
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Security header

    const { prompt, temperature, model } = req.body;

       // --- Debugging additions ---
    console.log("Received prompt:", prompt);
    console.log("Model:", model );//"models/gemini-2.5-flash"
    console.log("Temperature:", temperature);
    const contentsPayload = [{ role: 'user', parts: [{ text: prompt }] }];
    console.log("Contents payload being sent:", JSON.stringify(contentsPayload, null, 2));
    // --- End debugging additions ---

    // Validate incoming data
    if (!prompt) {
        return res.status(400).send('Prompt is required.');
    }
    if (!model) {
        return res.status(400).send('Model selection is required.');
    }

    try {

        // Start streaming content generation
        const result = await genAI.models.generateContentStream({
            model: model,
            generationConfig: {
                // Ensure temperature is a number between 0 and 1, defaulting if not provided or invalid
                temperature: typeof temperature === 'number' && temperature >= 0 && temperature <= 1 ? temperature : 0.7,
            },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
// --- Additional Debugging: Log the 'result' object ---
        console.log("Result object from generateContentStream:", result);
        // --- End Additional Debugging ---
// Iterate over the streamed chunks and send them to the client
         for await (const chunk of result) {
            // --- NEW Debugging: Log chunk details ---
            //console.log("Individual chunk received:", chunk);
            //console.log("Type of individual chunk:", typeof chunk);
            // console.log("Does chunk have .text() method?", typeof chunk.text === 'function'); // No longer relevant after fix
            // --- End NEW Debugging ---

            // CORRECTED: Access the text content from the nested structure
            const chunkText = chunk.candidates &&
                              chunk.candidates[0] &&
                              chunk.candidates[0].content &&
                              chunk.candidates[0].content.parts &&
                              chunk.candidates[0].content.parts[0] ?
                              chunk.candidates[0].content.parts[0].text : '';

            if (chunkText) {
                res.write(chunkText); // Write each chunk to the response stream
            }
        }


        // End the response after all chunks have been sent
        res.end();
        console.log('Streaming complete for prompt:', prompt);

    } catch (error) {
        console.error('Error generating content:', error);
        // If an error occurs during streaming, ensure the response is ended gracefully
        if (!res.headersSent) {
            res.status(500).send('Error generating content from LLM.');
        } else {
            res.end(`\nError: ${error.message || 'Unknown error during streaming.'}`);
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
