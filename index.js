/**
 * @fileOverview Main entry point for AstraX.
 * Fixed for Render port-binding and 24/7 uptime.
 */
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bot from './src/core/Bot.js';
import { logger } from './src/core/logger.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 10000;

app.use(express.json());

// ─────────────────────────────────────────────
// RENDER PORT BINDING & KEEP-ALIVE
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    bot: 'AstraX Enterprise',
    uptime: Math.floor(process.uptime()),
    memory: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`
  });
});

bot.io = io;

// Keep-alive ping every 14 minutes
setInterval(() => {
  fetch(`http://localhost:${PORT}`).catch(() => {});
}, 14 * 60 * 1000);

async function start() {
  httpServer.listen(PORT, () => {
    logger.success('SERVER', `Dummy port ${PORT} opened for Render`);
  });
  
  logger.info('BOOT', 'Initiating Swarm for Baileys core...');
  await bot.init();
}

start();

process.on('uncaughtException', (err) => {
  logger.error('CRASH', 'Uncaught Exception', err.message);
});

process.on('unhandledRejection', (err) => {
  logger.error('CRASH', 'Unhandled Rejection', err?.message || err);
});
