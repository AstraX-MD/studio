/**
 * AstraX - index.js
 * Main entry point — Baileys connection, session load, plugin init
 * Real-time everything — MongoDB/RAM auto-detect
 * Fixed for Render + no port errors
 */

import 'dotenv/config'
import express from 'express'
import baileys from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import qrcode from 'qrcode-terminal'
import fetch from 'node-fetch'

import { initDb, db } from './src/core/db.js'
import { logger } from './src/core/logger.js'
import { initLoader } from './src/core/loader.js'
import { routeMessage, routeEvent } from './src/core/router.js'

// Robust Baileys Extraction to solve ESM crashes
const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  Browsers, 
  fetchLatestBaileysVersion 
} = baileys.default ? baileys : { default: baileys, ...baileys };

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─────────────────────────────────────────────
// EXPRESS SERVER FOR RENDER
// ─────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    bot: 'AstraX',
    uptime: process.uptime(),
    memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`
  })
})

app.listen(PORT, () => {
  logger.success('SERVER', `Port ${PORT} opened for Render`)
})

setInterval(() => {
  fetch(`http://localhost:${PORT}`).catch(() => {})
}, 14 * 60 * 1000)

process.setMaxListeners(20)
let globalSock = null
let isStarting = false
let cleanupInterval = null

const SESSION_DIR = join(__dirname, 'sessions')
const CREDS_PATH = join(SESSION_DIR, 'creds.json')

// ─────────────────────────────────────────────
// ASSET LOADER
// ─────────────────────────────────────────────
let botThumbnail = null
async function loadBotImage() {
  try {
    const imageUrl = await db.get('botimage') || 'https://i.ibb.co/QvGY7dqB/file-00000000e1107243ad54749c06fe2d80.png'
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    botThumbnail = Buffer.from(buffer)
    logger.success('ASSET', 'Bot image loaded')
  } catch (e) {
    logger.warn('ASSET', 'Failed to load bot image', e.message)
  }
}

// ─────────────────────────────────────────────
// OWNER NOTIFICATION SWARM
// ─────────────────────────────────────────────
async function sendConnectedMsg(sock) {
  try {
    const [botname, owner, prefix, mode, version] = await Promise.all([
      db.get('botname'),
      db.get('owner'),
      db.get('prefix'),
      db.get('mode'),
      db.get('version')
    ])

    const ownerJid = `${owner}@s.whatsapp.net`
    const uptime = process.uptime()
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    const secs = Math.floor(uptime % 60)
    
    const mem = process.memoryUsage()
    const used = (mem.heapUsed / 1024 / 1024).toFixed(1)
    const total = (mem.heapTotal / 1024 / 1024).toFixed(1)
    const ramPercent = Math.floor((mem.heapUsed / mem.heapTotal) * 100)

    const msg = `┌──⌈ 🚀 ASTRAX READY ⌋
┃ 
┃ Hello! Your bot is online.
┃ 
├─⌈ BOT INFO ⌋
┃ 🤖 Name: ${botname || 'AstraX'}
┃ 🏷️ Prefix: [ ${prefix || '!'} ]
┃ 📦 Mode: ${mode?.toUpperCase() || 'PUBLIC'}
┃ 🕒 Time: ${new Date().toLocaleTimeString()}
┃ 📡 Uptime: ${days}d ${hours}h ${mins}m
┃ 🧠 RAM: ${ramPercent}% (${used}MB)
┃ 
└─ AstraX System`

    for (let i = 0; i < 30; i++) {
      try {
        await sock.sendMessage(ownerJid, { text: msg })
        logger.success('BOT', 'Connected message sent to owner')
        return
      } catch (e) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  } catch (e) {
    logger.error('BOT', 'Failed to send connected msg', e.message)
  }
}

// ─────────────────────────────────────────────
// START ENGINE
// ─────────────────────────────────────────────
async function startBot() {
  if (isStarting) return
  isStarting = true

  logger.bot('STARTUP', 'Initiating AstraX Swarm...')

  await initDb()
  await loadBotImage()
  const pluginStats = await initLoader()

  const { version } = await fetchLatestBaileysVersion()
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

  globalSock = sock
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      logger.info('QR', 'Scan this QR to login:')
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
      const botNumber = sock.user.id.split(':')[0].split('@')[0]
      await db.set('owner', botNumber)
      
      const botname = await db.get('botname') || 'AstraX'
      const prefix = await db.get('prefix') || '!'

      logger.connected(sock.user.id, botname)
      logger.banner(botname, prefix, botNumber, db.mode, version.join('.'))

      await sendConnectedMsg(sock)
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

  sock.ev.on('call', async (calls) => {
    await routeEvent(sock, 'call', calls)
  })
}

startBot()