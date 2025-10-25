import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.port || 3060;

app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenAI({
    apiKey: process.env.key_gem2,
    apiVersion: 'v1beta',
});

app.post('/generate-content', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const { prompt, history, temperature, model } = req.body;

    if (!prompt && (!history || history.length === 0)) {
        return res.status(400).send('A prompt or history is required.');
    }
    if (!model) {
        return res.status(400).send('Model selection is required.');
    }

    try {
        const contents = history && history.length > 0 ? history : [{ role: 'user', parts: [{ text: prompt }] }];

        const result = await genAI.models.generateContentStream({
            model: model,
            generationConfig: {
                temperature: typeof temperature === 'number' && temperature >= 0 && temperature <= 1 ? temperature : 0.7,
            },
            contents: contents,
        });

        for await (const chunk of result) {
            const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (chunkText) {
                res.write(chunkText);
            }
        }

        res.end();
    } catch (error) {
        console.error('Error generating content:', error);
        if (!res.headersSent) {
            res.status(500).send('Error generating content from LLM.');
        } else {
            res.end();
        }
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});