/**
 * @fileOverview Main entry point for AstraX Enterprise.
 * v1.2.5: Optimized for Cloud Hosting with Clean Telemetry.
 */
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';

// Import Bot Core
import bot from './src/core/Bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 9002;

// Middleware
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

/**
 * SHARED SOCKET INSTANCE
 */
bot.io = io;

/**
 * LIVE HTML RENDERER
 */
app.get('/render', (req, res) => {
  const code = req.query.html;
  if (!code) return res.status(400).send('<h1>AstraX Render Engine</h1><p>No payload detected.</p>');
  
  try {
    const decoded = Buffer.from(code, 'base64').toString('utf-8');
    res.send(decoded);
  } catch (e) {
    res.status(500).send('<h1>Render Error</h1><p>Invalid encoding signature.</p>');
  }
});

/**
 * DASHBOARD API ROUTES
 */

app.get('/api/status', async (req, res) => {
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const usedMem = memUsage.rss;
  const ramPercent = ((usedMem / totalMem) * 100).toFixed(2);

  res.json({
    status: bot.isReady ? 'online' : 'initializing',
    ramUsage: `${ramPercent}%`,
    uptime: Math.floor(process.uptime()),
    botName: bot.config.name,
    prefix: await bot.managers.settings.get('core', 'prefix') || '!',
    commands: bot.commands.size,
    session: bot.config.sessionName
  });
});

app.post('/api/pair', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  
  try {
    const code = await bot.client.getPairingCode(phone);
    res.json({ success: true, code });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * TELEMETRY STREAM
 */
setInterval(async () => {
  if (io.sockets.sockets.size > 0) {
    const memUsage = process.memoryUsage();
    io.emit('telemetry', {
      ram: (memUsage.rss / 1024 / 1024).toFixed(1),
      cpu: os.loadavg()[0].toFixed(2),
      uptime: Math.floor(process.uptime()),
      connected: bot.isReady
    });
  }
}, 3000);

/**
 * ENGINE BOOT
 */
async function start() {
  httpServer.listen(PORT, () => {
    console.log(`\n==> CONSOLE: Live on port ${PORT}`);
    console.log(`==> PROJECT: AstraX Enterprise v1.2.5`);
  });

  try {
    await bot.init();
  } catch (error) {
    console.error('==> CRITICAL: Boot failure:', error.message);
  }
}

start();
