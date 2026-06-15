/**
 * @fileOverview Main entry point for AstraX Enterprise.
 * Integrates Bot Core with a Real-Time Glassmorphic Management Dashboard and Live HTML Renderer.
 */
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
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
 * LIVE HTML RENDERER
 * Allows the AI to generate and preview web apps instantly.
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

// 1. Get System Status
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

// 2. Get All Commands
app.get('/api/commands', (req, res) => {
  const manifest = bot.getCommandManifest();
  res.json(manifest);
});

// 3. Update Settings
app.post('/api/settings', async (req, res) => {
  const { category, key, value } = req.body;
  await bot.managers.settings.set(category, key, value, 'global');
  res.json({ success: true, message: `Updated ${category}.${key}` });
});

// 4. Toggle Command
app.post('/api/commands/toggle', async (req, res) => {
  const { name, status } = req.body;
  const disabledList = await bot.db.get('settings', 'disabledCommands') || [];
  
  let newList;
  if (status === false) {
    if (!disabledList.includes(name)) disabledList.push(name);
    newList = disabledList;
  } else {
    newList = disabledList.filter(n => n !== name);
  }
  
  await bot.db.set('settings', 'disabledCommands', newList);
  res.json({ success: true, newList });
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
      uptime: Math.floor(process.uptime())
    });
  }
}, 3000);

/**
 * ENGINE BOOT
 */
async function start() {
  console.log(`\n==> ASTRAX: Initializing Web Console on port ${PORT}...`);
  
  httpServer.listen(PORT, () => {
    console.log(`==> DASHBOARD: Operational at http://localhost:${PORT}`);
    console.log(`==> RENDERER: Available at http://localhost:${PORT}/render`);
  });

  try {
    await bot.init();
  } catch (error) {
    console.error('==> CRITICAL: Bot Core failed to boot:', error);
  }
}

start();
