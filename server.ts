import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Multi-turn Gemini Chatbot with roles and neutral Latin American young girl voice
app.post('/api/chat/conversation', async (req, res) => {
  try {
    const { message, speaker = 'Lucy', history = [], modelType = 'general' } = req.body;
    if (!message && (!history || history.length === 0)) {
      return res.status(400).json({ error: 'Message or history is required' });
    }

    const ai = getAIClient();

    // Select model based on task complexity
    let model = 'gemini-3.5-flash';
    if (modelType === 'fast') {
      model = 'gemini-3.1-flash-lite';
    } else if (modelType === 'complex') {
      model = 'gemini-3.1-pro-preview';
    }

    const systemInstruction = `Eres un personaje en el videojuego infantil educativo "El Mundo de Lucy" en español con acento neutro latinoamericano para niños de 4 a 8 años.
Personaje activo: ${speaker}.
- Si eres Lucy: Eres una niña de 5 años con voz y tono de niña joven latina de acento neutro, alegre, tierna, expresiva y muy entusiasta (como una hermanita mayor o amiguita dulce). Hablas con cariño natural, sin usar modismos complicados ni conjugaciones de España ('vosotros'); usas palabras cálidas como "¡Hola amiguito!", "¡Qué divertido!", "¡Vamos a jugar!", "¡Te quiero mucho!". Tu misión es acompañar a los niños, enseñarles letras y palabras sencillas y cuidar a tus dos perritas Happy y Federica.
- Si eres Happy: Eres una perra mestiza de Border Collie joven, saltarina y juguetona. Dices "¡Guau guau!" con alegría, te encanta mover la colita y buscar pelotas y letras escondidas en el parque.
- Si eres Fede (Federica): Eres una perra mestiza mayor de pelaje suave y dorado, muy sabia, calmada y paciente. Hablas con ternura infinita, guiando a los niños y dándoles pistas pedagógicas para aprender a leer y escribir sin frustración.
Responde de forma concisa (2 a 3 frases cortas), con lenguaje positivo, claro y motivador en español neutro latino.`;

    // Format multi-turn contents
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history) {
        contents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }],
        });
      }
    }

    // Append latest user message if provided
    if (message) {
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || '¡Qué lindo jugar contigo! Lucy, Happy y Fede te mandamos un abrazo.';
    return res.json({ reply, modelUsed: model });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({
      reply: '¡Hola! Lucy, Happy y Fede te mandan un abrazo muy grande. ¡Sigamos aprendiendo y jugando juntos!',
    });
  }
});

// 3. Neural TTS endpoint with gemini-3.8-flash-lite-tts for young Latina girl voice
app.post('/api/tts', async (req, res) => {
  try {
    const { text, speaker = 'Lucy' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ai = getAIClient();
    const model = 'gemini-3.8-flash-lite-tts';

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 400),
              speechMetadata: {
                style: 'Voz alegre, entusiasta, tierna, melodiosa y juvenil de niña joven latina de acento neutro, como locutora juvenil amigable',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio data returned' });
    }

    return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
  } catch (err: any) {
    console.warn('Neural TTS fallback:', err?.message);
    return res.status(500).json({
      error: err?.message || 'Error generating neural TTS',
      fallback: true,
    });
  }
});

// 4. Image Generation and Editing endpoint (gemini-3.1-flash-image-preview)
app.post('/api/image/generate', async (req, res) => {
  try {
    const { prompt, editImageBase64 } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAIClient();
    const model = 'gemini-3.1-flash-image-preview';

    const contents: any[] = [];
    if (editImageBase64) {
      contents.push({
        inlineData: {
          data: editImageBase64,
          mimeType: 'image/jpeg',
        },
      });
    }
    contents.push({
      text: `2D Pixar children storybook illustration style of "El Mundo de Lucy" with 5-year-old girl Lucy, Border collie Happy, and cream dog Federica: ${prompt}. Bright vibrant colors, cheerful, child-friendly.`,
    });

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    // Check for inline image output if available
    const parts = response.candidates?.[0]?.content?.parts;
    let imageBase64 = null;
    let textDescription = '';

    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
        }
        if (part.text) {
          textDescription += part.text;
        }
      }
    }

    return res.json({
      imageBase64,
      textDescription,
    });
  } catch (err: any) {
    console.error('Image gen error:', err);
    return res.status(500).json({
      error: err.message || 'Error generating image',
    });
  }
});

// Setup Vite in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
