import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Audio cache to store generated TTS MP3 buffers for instant playback
const audioCache = new Map<string, { buffer: Buffer; contentType: string }>();

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    tts: 'ready',
    cachedCount: audioCache.size,
    timestamp: new Date().toISOString(),
  });
});

// High-fidelity AI Text-To-Speech endpoint for kids learning
app.get('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawText = (req.query.text as string || '').trim();
    const lang = (req.query.lang as string || 'en').trim();

    if (!rawText) {
      res.status(400).json({ error: 'Missing text parameter' });
      return;
    }

    // Limit text length to prevent abuse (max 200 chars is plenty for words/sentences)
    const text = rawText.slice(0, 200);
    const cacheKey = `${lang}:${text.toLowerCase()}`;

    // Return cached audio if available
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      res.setHeader('X-TTS-Cache', 'HIT');
      res.send(cached.buffer);
      return;
    }

    // Fetch high-fidelity speech from Google TTS service
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
    });

    if (!response.ok) {
      console.error(`TTS fetch failed with status: ${response.status}`);
      res.status(502).json({ error: 'TTS service failed' });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    // Store in cache (cap at 1000 items to avoid unbounded memory)
    if (audioCache.size > 1000) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, { buffer, contentType });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('X-TTS-Cache', 'MISS');
    res.send(buffer);
  } catch (err) {
    console.error('TTS endpoint error:', err);
    res.status(500).json({ error: 'Internal TTS error' });
  }
});

// Vite middleware & Static serving
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
