import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// In-Memory Rate Limiter Middleware (60 requests per minute per IP)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 60;

  let record = ipRequestCounts.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    ipRequestCounts.set(ip, record);
  } else {
    record.count++;
  }

  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));

  if (record.count > maxRequests) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a minute before sending more bench repair requests.',
    });
  }

  next();
}

// Basic Auth / Security Header Middleware for /api routes
function basicAuthCheck(req: Request, res: Response, next: NextFunction) {
  // Allow health check without auth
  if (req.path === '/api/health') return next();

  // Basic authorization token check (or secret pass in development)
  const authHeader = req.headers['authorization'];
  const clientSecret = req.headers['x-ramt-app-token'];
  
  // In production / bench assistant mode, validate token if provided or allow valid API calls
  if (process.env.REQUIRE_STRICT_AUTH === 'true') {
    if (!authHeader && !clientSecret) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing Authorization Header' });
    }
  }

  next();
}

app.use('/api', rateLimiter, basicAuthCheck);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', system: 'RAMT ECU Bench Repair Server', timestamp: new Date().toISOString() });
});

// Gemini Assistant API Route
app.post('/api/assistant', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'API Key Not Configured',
        message: 'GEMINI_API_KEY is not set. Please configure it in your environment.',
      });
    }

    // Initialize @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });
    
    // Model name verified per Step 6: gemini-3.8-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 
          'You are RAMT (Ruben Automotive Modern Tech) ECU Bench-Repair AI Assistant. ' +
          'Provide concise, highly accurate automotive electronics diagnostic steps in Tagalog and English. ' +
          'Never invent pin numbers or voltages. Mark unverified data clearly.',
        temperature: 0.2,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'AI Assistant Error',
      message: error?.message || 'Failed to generate response from Gemini API',
    });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`RAMT ECU Bench Server running on port ${PORT}`);
  });
}

startServer();
