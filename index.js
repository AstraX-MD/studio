/**
 * @fileOverview Main entry point for AstraX.
 * v1.2.5: Optimized for Cloud Hosting with High-End Dashboard API.
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

const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

/**
 * SHARED SOCKET INSTANCE
 */
bot.io = io;

/**
 * DASHBOARD API ROUTES
 */

// Tab 1: System Info
app.get('/api/status', async (req, res) => {
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const ramPercent = ((memUsage.rss / totalMem) * 100).toFixed(2);
  const prefix = await bot.managers.settings.get('core', 'prefix') || '!';

  res.json({
    status: bot.isReady ? 'online' : 'initializing',
    ram: `${ramPercent}%`,
    uptime: Math.floor(process.uptime()),
    botName: await bot.managers.settings.get('core', 'name') || bot.config.name,
    prefix: prefix,
    owner: bot.config.owners[0] || 'Not Set',
    uniqueModules: new Set(bot.commands.values()).size,
    totalTriggers: bot.commands.size,
    thumbnail: bot.config.thumbnail
  });
});

// Tab 1: Update Bot Config
app.post('/api/update-config', async (req, res) => {
  const { name, prefix, thumbnail } = req.body;
  if (name) {
    bot.config.name = name;
    await bot.managers.settings.set('core', 'name', name);
  }
  if (prefix) {
    bot.config.prefix = prefix;
    await bot.managers.settings.set('core', 'prefix', prefix);
  }
  if (thumbnail) {
    bot.config.thumbnail = thumbnail;
    await bot.managers.settings.set('core', 'thumbnail_url', thumbnail);
  }
  res.json({ success: true });
});

// Tab 2: Feature Toggles
app.get('/api/features', async (req, res) => {
  const features = [
    { id: 'antidelete', name: 'Anti-Delete', category: 'security' },
    { id: 'antiedit', name: 'Anti-Edit', category: 'security' },
    { id: 'autoread', name: 'Auto-Read', category: 'automation' },
    { id: 'autotyping', name: 'Auto-Typing', category: 'automation' },
    { id: 'autoonline', name: 'Always Online', category: 'automation' },
    { id: 'autoreact', name: 'Auto-React', category: 'automation' }
  ];

  const results = [];
  for (const f of features) {
    const val = await bot.managers.settings.get(f.category, f.id) || false;
    results.push({ ...f, status: val });
  }
  res.json(results);
});

app.post('/api/toggle-feature', async (req, res) => {
  const { category, id, status } = req.body;
  await bot.managers.settings.set(category, id, status);
  res.json({ success: true });
});

// Tab 3: Command Explorer
app.get('/api/commands', (req, res) => {
  const manifest = bot.getCommandManifest();
  res.json(manifest);
});

// Tab 4: Analytics
app.get('/api/analytics', async (req, res) => {
  const usage = await bot.db.all('command_usage') || {};
  const sorted = Object.entries(usage)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const total = sorted.reduce((sum, item) => sum + item.count, 0);

  res.json({
    totalExecuted: total,
    mostUsed: sorted.slice(0, 5),
    unused: bot.getCommandManifest().filter(c => !usage[c.name]).length,
    failed: await bot.db.get('stats', 'failed_count') || 0
  });
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
    console.log(`\n\x1b[36m┌──⌈ 🌌 ASTRAX ⌋\x1b[0m`);
    console.log(`\x1b[36m┃ Console: Live on port ${PORT}\x1b[0m`);
    console.log(`\x1b[36m┃ Status: Active\x1b[0m`);
    console.log(`\x1b[36m└─────────────────────────\x1b[0m\n`);
  });

  try {
    await bot.init();
  } catch (error) {
    console.error('==> CRITICAL: Boot failure:', error.message);
  }
}

start();
