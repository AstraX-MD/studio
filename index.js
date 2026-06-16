/**
 * AstraX - index.js
 * Main entry point — Baileys connection, session load, plugin init
 * Fixed for Render + no port errors + NO EXITS ON MISSING FILES
 */

import 'dotenv/config'
import express from 'express'
import baileys from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import qrcode from 'qrcode-terminal'

import { initDb, db } from './system/db.js'
import { logger } from './system/logger.js'
import { initLoader } from './system/loader.js'
import { routeMessage, routeEvent } from './system/router.js'

// Safe Baileys Extraction
const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  Browsers, 
  fetchLatestBaileysVersion 
} = baileys || {}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─────────────────────────────────────────────
// 5 WAYS API LOADER — NEVER EXIT ON FAIL
// ─────────────────────────────────────────────
let initApi = null
async function loadApi() {
  const paths = [
    './system/api.js',
    './system/api.js?t=' + Date.now(),
    './system/api',
    '/opt/render/project/src/system/api.js'
  ]
  for (const path of paths) {
    try {
      const mod = await import(path)
      initApi = mod.initApi
      if (initApi) return logger.success('SYSTEM', `API loaded via: ${path}`)
    } catch (e) {}
  }
  initApi = async () => {
    logger.warn('SYSTEM', 'API unavailable - using fallback dummy')
    return { success: true, fallback: true }
  }
}

await loadApi()

// Skip if smartchannel missing
let initSmartChannel = null
try {
  const smartchannelModule = await import('./plugins/observers/automations/smartchannel.js')
  initSmartChannel = smartchannelModule.init
} catch (e) {
  logger.warn('SYSTEM', 'smartchannel.js missing - skipping')
}

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
  logger.success('SERVER', `Dummy port ${PORT} opened for Render`)
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

function loadSessionFromEnv() {
  const sessionId = process.env.SESSION_ID
  if (!sessionId || !sessionId.startsWith('ASTRAX~')) {
    logger.warn('SESSION', 'No SESSION_ID found - QR mode active')
    return false
  }
  try {
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true })
    const base64Data = sessionId.replace('ASTRAX~', '')
    const decoded = Buffer.from(base64Data, 'base64').toString('utf-8')
    fs.writeFileSync(CREDS_PATH, decoded)
    logger.success('SESSION', 'Session loaded from environment')
    return true
  } catch (e) {
    logger.warn('SESSION', 'Failed to decode SESSION_ID', e.message)
    return false
  }
}

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
// OWNER NOTIFICATION SWARM (30 RETRIES)
// ─────────────────────────────────────────────
async function sendConnectedMsg(sock) {
  try {
    const [botname, owner, prefix, mode, platform, version] = await Promise.all([
      db.get('botname'),
      db.get('owner'),
      db.get('prefix'),
      db.get('mode'),
      db.get('platform'),
      db.get('version')
    ])

    const ownerJid = `${owner}@s.whatsapp.net`
    const uptime = process.uptime()
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    const mem = process.memoryUsage()
    const used = (mem.heapUsed / 1024 / 1024).toFixed(1)
    const total = (mem.heapTotal / 1024 / 1024).toFixed(1)
    const ramPercent = Math.floor((mem.heapUsed / mem.heapTotal) * 100)

    const msg = `┌──⌈ 🌌 ASTRAX READY ⌋
┃ 👤 User: @${owner || 'Not Set'}
┃ 🏷️ Prefix: [ ${prefix || '?'} ]
┃ 📦 Mode: ${mode?.toUpperCase() || 'PUBLIC'}
┃ 🕒 Time: ${new Date().toLocaleTimeString()}
┃ 📡 Uptime: ${days}d ${hours}h ${mins}m
┃ 🧠 RAM: ${ramPercent}% (${used}MB / ${total}MB)
┃ 🛰️ Platform: ${platform || 'Render'}
┃ 🛡️ Status: OPTIMIZED
┃ 
└─ AstraX Enterprise`

    const contextInfo = {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: 'AstraX Enterprise',
        body: 'Node Operational ✅',
        mediaType: 1,
        thumbnail: botThumbnail,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
        showAdAttribution: true
      }
    }

    // 30-Way Sending Swarm
    for (let i = 0; i < 30; i++) {
      try {
        await sock.sendMessage(ownerJid, { text: msg, contextInfo, mentions: [ownerJid] })
        logger.success('BOT', 'Connected report sent to owner')
        return
      } catch (e) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  } catch (e) {
    logger.error('BOT', 'Failed connected report', e.message)
  }
}

function startRamCleanup() {
  if (cleanupInterval) clearInterval(cleanupInterval)
  cleanupInterval = setInterval(() => {
    const mem = process.memoryUsage()
    if (mem.heapUsed / 1024 / 1024 > 450) {
      if (global.gc) global.gc()
    }
    logger.ramStats()
  }, 60000)
}

async function startBot() {
  if (isStarting) return
  isStarting = true
  logger.bot('STARTUP', 'Initializing Engine...')

  await initDb()
  await initApi()
  if (!fs.existsSync(CREDS_PATH)) loadSessionFromEnv()
  await loadBotImage()
  await initLoader()

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
      logger.info('QR', 'Scan to login:')
      qrcode.generate(qr, { small: true })
    }
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      if (statusCode !== DisconnectReason.loggedOut) {
        isStarting = false
        setTimeout(() => startBot(), 10000)
      } else {
        logger.error('AUTH', 'Logged out. Manual re-pairing needed.')
        isStarting = false
      }
    } else if (connection === 'open') {
      const botNumber = sock.user.id.split(':')[0].split('@')[0]
      await db.set('owner', botNumber)
      const botname = await db.get('botname') || 'AstraX'
      const prefix = await db.get('prefix') || '?'
      logger.connected(sock.user.id, botname)
      logger.banner(botname, prefix, botNumber, db.mode, version.join('.'))
      await sendConnectedMsg(sock)
      startRamCleanup()
      if (initSmartChannel) initSmartChannel(sock, db, logger)
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

process.on('uncaughtException', (err) => logger.error('CRASH', 'Uncaught', err.message))
process.on('unhandledRejection', (err) => logger.error('CRASH', 'Rejection', err?.message))

startBot()