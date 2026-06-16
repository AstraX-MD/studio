/**
 * AstraX Enterprise - index.js
 * Main entry point — Baileys connection, session load, plugin init
 * Fixed for Render + no port errors
 */

import 'dotenv/config'
import express from 'express'
import pino from 'pino'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import qrcode from 'qrcode-terminal'
import baileys from '@whiskeysockets/baileys'

import bot from './src/core/Bot.js'
import { logger } from './src/core/logger.js'
import { initLoader } from './src/core/loader.js'
import { routeMessage, routeEvent } from './src/core/router.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─────────────────────────────────────────────
// BAILEYS DEFENSIVE SWARM PROBE
// ─────────────────────────────────────────────
function probe(pkg, name) {
  const source = pkg?.default || pkg;
  if (source && source[name]) return source[name];
  if (typeof source === 'function' && name === 'makeWASocket') return source;
  if (source && typeof source === 'object') {
    const keys = Object.keys(source);
    const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
    if (match) return source[match];
  }
  return null;
}

// ─────────────────────────────────────────────
// EXPRESS SERVER FOR RENDER
// ─────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    bot: 'AstraX Enterprise',
    uptime: Math.floor(process.uptime()),
    memory: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`
  })
})

app.listen(PORT, () => {
  logger.success('SERVER', `Dummy port ${PORT} opened for Render`)
})

// Keep-alive ping every 14 minutes
setInterval(() => {
  fetch(`http://localhost:${PORT}`).catch(() => {})
}, 14 * 60 * 1000)

let isStarting = false

// ─────────────────────────────────────────────
// START BOT
// ─────────────────────────────────────────────
async function startBot() {
  if (isStarting) return
  isStarting = true

  logger.bot('STARTUP', 'Initiating AstraX Swarm...')

  await bot.db.init()
  const loaderStats = await initLoader()

  // Probing Baileys internals
  const makeWASocket = probe(baileys, 'makeWASocket');
  const useMultiFileAuthState = probe(baileys, 'useMultiFileAuthState');
  const DisconnectReason = probe(baileys, 'DisconnectReason');
  const Browsers = probe(baileys, 'Browsers');
  const fetchLatestBaileysVersion = probe(baileys, 'fetchLatestBaileysVersion');

  if (!useMultiFileAuthState || !makeWASocket) {
    logger.error('CRASH', 'Failed to resolve Baileys core functions. Check ESM export mapping.')
    process.exit(1)
  }

  const { version } = await fetchLatestBaileysVersion()
  const SESSION_DIR = join(__dirname, 'sessions', bot.config.sessionName)
  
  if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: true,
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => false,
    generateHighQualityLinkPreview: true
  })

  bot.client.sock = sock
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      logger.info('QR', 'Scan this QR to login:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut

      logger.error('SOCKET', `Closed (${statusCode})`, lastDisconnect?.error?.message)

      if (shouldReconnect) {
        logger.warn('SOCKET', 'Restarting node in 10s...')
        isStarting = false
        setTimeout(() => startBot(), 10000)
      } else {
        logger.error('SOCKET', 'Logged out. Manual re-pair required.')
        process.exit(1)
      }

    } else if (connection === 'open') {
      const botname = await bot.managers.settings.get('core', 'name') || bot.config.name
      const prefix = await bot.managers.settings.get('core', 'prefix') || bot.config.prefix
      const owner = bot.config.owners[0] || 'Not Set'

      logger.connected(sock.user.id, botname)
      logger.banner(botname, prefix, owner, bot.db.activeProviderName, version.join('.'))

      // 30 FALLBACK OWNER NOTIFICATION
      await _notifyOwner(sock, bot)
      isStarting = false
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const m of messages) {
      await routeMessage(sock, m, bot)
    }
  })

  sock.ev.on('group-participants.update', async (update) => {
    await routeEvent(sock, 'group-participants.update', update, bot)
  })

  sock.ev.on('messages.update', async (updates) => {
    for (const update of updates) {
      if (update.update.messageStubType === 8) {
        await routeEvent(sock, 'messages.delete', update, bot)
      }
      if (update.update.message) {
        await routeEvent(sock, 'messages.edit', update, bot)
      }
    }
  })

  sock.ev.on('call', async (calls) => {
    await routeEvent(sock, 'call', calls, bot)
  })
}

/**
 * Expert Owner Notification with 30 Fallbacks
 */
async function _notifyOwner(sock, botInstance) {
  const rawId = sock.user.id.split(':')[0]
  const jid = `${rawId}@s.whatsapp.net`
  const botName = await botInstance.managers.settings.get('core', 'name') || 'AstraX'
  const prefix = await botInstance.managers.settings.get('core', 'prefix') || '!'
  const uniqueCount = new Set(botInstance.commands.values()).size
  
  let platform = 'Cloud Host'
  if (process.env.RENDER) platform = 'Render.com'
  else if (process.env.RAILWAY_PROJECT_ID) platform = 'Railway.app'

  const report = `┌──⌈ 🚀 ASTRAX READY ⌋
┃ 
┃ Hello! Your bot is now 
┃ online and working.
┃ 
├─⌈ BOT INFO ⌋
┃ 
┃ 🤖 Name: ${botName}
┃ 🏷️ Prefix: [ ${prefix} ]
┃ 📦 Tools: ${uniqueCount}
┃ 🕒 Time: ${new Date().toLocaleTimeString()}
┃ 📡 Platform: ${platform}
┃ 
├─⌈ STATUS ⌋
┃ 
┃ ✅ System: STABLE
┃ ✅ Safety: ARMED
┃ ✅ Uptime: 24/7 ACTIVE
┃ 
└─ AstraX System`

  for (let i = 0; i < 30; i++) {
    try {
      await sock.sendMessage(jid, { 
        image: { url: botInstance.config.thumbnail },
        caption: report
      })
      logger.success('BOT', 'Owner report delivered (Image mode)')
      return
    } catch (e) {
      try {
        await sock.sendMessage(jid, { text: report })
        logger.success('BOT', 'Owner report delivered (Text mode)')
        return
      } catch (e2) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  }
}

process.on('uncaughtException', (err) => {
  logger.error('CRASH', 'Uncaught Exception', err.message)
})

process.on('unhandledRejection', (err) => {
  logger.error('CRASH', 'Unhandled Rejection', err?.message || err)
})

startBot()
