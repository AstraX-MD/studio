/**
 * AstraX Enterprise - index.js
 * High-speed entry point with Express port binding and 30-probe swarm.
 */

import 'dotenv/config'
import express from 'express'
import pino from 'pino'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import qrcode from 'qrcode-terminal'
import baileys from '@whiskeysockets/baileys'

import { initDb, db } from './src/core/db.js'
import { logger } from './src/core/logger.js'
import { initLoader } from './src/core/loader.js'
import { routeMessage, routeEvent } from './src/core/router.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─────────────────────────────────────────────
// BAILEYS DEFENSIVE SWARM PROBE (30+ WAYS)
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
  res.json({ status: 'online', bot: 'AstraX Enterprise', uptime: Math.floor(process.uptime()) })
})

app.listen(PORT, () => {
  logger.success('SERVER', `Port ${PORT} bound for Render`)
})

setInterval(() => {
  fetch(`http://localhost:${PORT}`).catch(() => {})
}, 14 * 60 * 1000)

let isStarting = false

async function startBot() {
  if (isStarting) return
  isStarting = true

  logger.bot('STARTUP', 'Initiating AstraX Swarm...')

  await initDb()
  const pluginStats = await initLoader()

  const makeWASocket = probe(baileys, 'makeWASocket');
  const useMultiFileAuthState = probe(baileys, 'useMultiFileAuthState');
  const DisconnectReason = probe(baileys, 'DisconnectReason');
  const Browsers = probe(baileys, 'Browsers');
  const fetchLatestBaileysVersion = probe(baileys, 'fetchLatestBaileysVersion');

  if (!useMultiFileAuthState || !makeWASocket) {
    logger.error('CRASH', 'Baileys core functions unresolved. Swarm failed.')
    process.exit(1)
  }

  const { version } = await fetchLatestBaileysVersion()
  const SESSION_DIR = join(__dirname, 'sessions')
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => false
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) {
      logger.info('QR', 'Scan to login:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      if (statusCode !== DisconnectReason.loggedOut) {
        isStarting = false
        setTimeout(() => startBot(), 10000)
      } else {
        process.exit(1)
      }
    } else if (connection === 'open') {
      const botNumber = sock.user.id.split(':')[0]
      await db.set('owner', botNumber)
      const botname = await db.get('botname') || 'AstraX'
      const prefix = await db.get('prefix') || '!'

      logger.connected(sock.user.id, botname)
      logger.banner(botname, prefix, botNumber, db.mode, version.join('.'))
      
      await _notifyOwner(sock, botNumber, botname, prefix, pluginStats.commands)
      isStarting = false
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const m of messages) {
      await routeMessage(sock, m)
    }
  })

  sock.ev.on('group-participants.update', async (update) => {
    await routeEvent(sock, 'group-participants.update', update)
  })
}

async function _notifyOwner(sock, owner, name, prefix, cmds) {
  const jid = `${owner}@s.whatsapp.net`
  const report = `┌──⌈ 🚀 ASTRAX READY ⌋
┃ 
┃ Hello! Your bot is online.
┃ 
├─⌈ BOT INFO ⌋
┃ 
┃ 🤖 Name: ${name}
┃ 🏷️ Prefix: [ ${prefix} ]
┃ 📦 Tools: ${cmds}
┃ 🕒 Time: ${new Date().toLocaleTimeString()}
┃ 📡 Platform: Cloud-Node
┃ 
└─ AstraX System`

  for (let i = 0; i < 30; i++) {
    try {
      await sock.sendMessage(jid, { text: report })
      return
    } catch (e) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

process.on('uncaughtException', (err) => logger.error('CRASH', err.message))
process.on('unhandledRejection', (err) => logger.error('CRASH', err?.message || err))

startBot()