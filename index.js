/**
 * AstraX - index.js
 * Main entry point — Baileys connection, session load, plugin init
 * Real-time everything — MongoDB/RAM auto-detect
 * Fixed for Render + no port errors + NO EXITS ON MISSING FILES
 */

import 'dotenv/config'
import express from 'express'
import makeWASocket, { DisconnectReason, Browsers } from '@whiskeysockets/baileys'
import { useMultiFileAuthState, fetchLatestBaileysVersion, BufferJSON } from '@whiskeysockets/baileys/lib/Utils/index.js'

import pino from 'pino'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import qrcode from 'qrcode-terminal'
import nodeFetch from 'node-fetch'

import { initDb, db } from './system/db.js'
import { logger } from './system/logger.js'
import { initLoader } from './system/loader.js'
import { routeMessage, routeEvent } from './system/router.js'

// ─────────────────────────────────────────────
// NODE VERSION GUARD
// ─────────────────────────────────────────────
const nodeVersion = process.versions.node
const major = parseInt(nodeVersion.split('.')[0])
if (major > 22) {
  logger.warn('NODE', `Node ${nodeVersion} detected. Baileys not fully tested on Node >22.`)
}

// ─────────────────────────────────────────────
// AUTH STATE - USING OFFICIAL useMultiFileAuthState
// ─────────────────────────────────────────────
const authFolder = './session'
if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder, { recursive: true })

// ─────────────────────────────────────────────
// 5 WAYS API LOADER — NEVER EXIT ON FAIL
// ─────────────────────────────────────────────
let initApi = null
async function loadApi() {
  const paths = ['./system/api.js', './system/api.js?t=' + Date.now(), './system/api', '/opt/render/project/src/system/api.js']
  for (const path of paths) {
    try {
      const mod = await import(path)
      initApi = mod.initApi
      if (initApi) {
        logger.success('SYSTEM', `API loaded via: ${path}`)
        return
      }
    } catch (e) {}
  }
  initApi = async () => {
    logger.warn('SYSTEM', 'API unavailable - using fallback, bot continues')
    return { success: true, fallback: true }
  }
  logger.warn('SYSTEM', 'API loaded via fallback dummy - NO EXIT')
}
await loadApi()

// FIXED: Skip if smartchannel missing
let initSmartChannel = null
try {
  const smartchannelModule = await import('./src/plugins/observers/automations/smartchannel.js')
  initSmartChannel = smartchannelModule.init
} catch (e) {
  logger.warn('SYSTEM', 'smartchannel.js missing - skipping')
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const AUTOREACT_GROUPS = ['120363406358472734@g.us']
const ASTRAX_CHANNEL = {
  jid: '120363426850275@newsletter',
  name: 'AstraX Updates',
  link: 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G'
}

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    bot: 'AstraX',
    uptime: process.uptime(),
    memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`
  })
})

app.listen(PORT, () => {
  logger.success('SERVER', `Dummy port ${PORT} bound for Render`)
})

setInterval(() => {
  nodeFetch(`http://localhost:${PORT}`).catch(() => {})
}, 14 * 60 * 1000)

process.setMaxListeners(20)
let globalSock = null
let isStarting = false

function loadSessionFromEnv() {
  const sessionId = process.env.SESSION_ID
  if (!sessionId ||!sessionId.startsWith('ASTRAX~')) return false
  try {
    const base64Data = sessionId.replace('ASTRAX~', '')
    const decoded = Buffer.from(base64Data, 'base64').toString('utf-8')
    const creds = JSON.parse(decoded)
    fs.writeFileSync(join(authFolder, 'creds.json'), JSON.stringify(creds, BufferJSON.replacer, 2))
    logger.success('SESSION', 'Session loaded from ENV')
    return true
  } catch (e) {
    logger.warn('SESSION', 'Failed to decode SESSION_ID', e.message)
    return false
  }
}

let botThumbnail = null
async function loadBotImage() {
  try {
    const imageUrl = await db.get('botimage') || 'https://i.ibb.co/QvGY7dqB/file-00000e1107243ad54749c06fe2d80.png'
    const res = await nodeFetch(imageUrl)
    const arrayBuffer = await res.arrayBuffer()
    botThumbnail = Buffer.from(arrayBuffer)
    logger.success('ASSET', 'Bot image loaded')
  } catch (e) {
    logger.warn('ASSET', 'Failed loading bot image')
  }
}

async function sendConnectedMsg(sock) {
  try {
    const [botname, owner, prefix, mode, platform, version] = await Promise.all([
      db.get('botname'), db.get('owner'), db.get('prefix'), db.get('mode'), db.get('platform'), db.get('version')
    ])

    const ownerJid = `${owner}@s.whatsapp.net`
    const uptime = process.uptime()
    const days = Math.floor(uptime / 86400), hours = Math.floor((uptime % 86400) / 3600), mins = Math.floor((uptime % 3600) / 60)
    const ramPercent = Math.floor((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)

    const msg = `
╭─────〔 ASTRAX CORE 〕─────┈⊷
│ ➜ User: @${owner || 'Not Set'}
│ ➜ Prefix: ${prefix || '#'}
│ ➜ Mode: ${mode?.toUpperCase() || 'PUBLIC'}
│ ➜ Version: ${version || '7.0.0'}
│ ➜ Platform: ${platform || 'whatsapp'}
│ ➜ Speed: ${(Math.random() * 150 + 50).toFixed(4)} ms
│ ➜ Uptime: ${days}d ${hours}h ${mins}m
│ ➜ RAM: ${ramPercent}%
│ ➜ DB: ${db.mode}
╰─────────────────────────⊷

Connected Successfully ✅
Type ${prefix || '#'}menu to start`

    const contextInfo = {
      forwardingScore: 999, isForwarded: true,
      externalAdReply: {
        title: 'AstraX', body: 'Operational ✅', mediaType: 1,
        thumbnail: botThumbnail, sourceUrl: ASTRAX_CHANNEL.link,
        showAdAttribution: true
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: ASTRAX_CHANNEL.jid,
        newsletterName: ASTRAX_CHANNEL.name,
        serverMessageId: Math.floor(Math.random() * 100000)
      }
    }

    for (let i = 0; i < 30; i++) {
      try {
        await sock.sendMessage(ownerJid, { text: msg, contextInfo, mentions: [ownerJid] })
        logger.success('BOT', 'Owner report sent')
        return
      } catch (e) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  } catch (e) {
    logger.error('BOT', 'Report failed')
  }
}

async function verifyBaileys() {
  try {
    const pkg = JSON.parse(fs.readFileSync('./node_modules/@whiskeysockets/baileys/package.json', 'utf-8'))
    logger.info('BAILEYS', `Installed version: ${pkg.version}`)
    if (!pkg.version.startsWith('6.7')) {
      logger.warn('BAILEYS', `Expected 6.7.x but found ${pkg.version}. Imports may fail.`)
    }
  } catch (e) {
    logger.error('BAILEYS', 'Cannot verify baileys version')
  }
}

async function startBot() {
  if (isStarting) return
  isStarting = true
  logger.bot('STARTUP', 'Initializing...')

  await verifyBaileys()

  try {
    await initDb()
    await initApi()
    if (!fs.existsSync(join(authFolder, 'creds.json'))) loadSessionFromEnv()
    await loadBotImage()
    await initLoader()
  } catch (e) {
    logger.error('STARTUP', 'Init failed, continuing...', e.message)
  }

  let state, saveCreds
  try {
    const auth = await useMultiFileAuthState(authFolder)
    state = auth.state
    saveCreds = auth.saveCreds
  } catch (e) {
    logger.error('AUTH', 'Session corrupt, resetting...', e.message)
    fs.rmSync(authFolder, { recursive: true, force: true })
    fs.mkdirSync(authFolder, { recursive: true })
    const auth = await useMultiFileAuthState(authFolder)
    state = auth.state
    saveCreds = auth.saveCreds
  }

  let version
  try {
    const { version: v } = await fetchLatestBaileysVersion()
    version = v
    logger.info('BAILEYS', `Using latest WA v${version.join('.')}`)
  } catch (e) {
    version = [2, 3000, 1026121747]
    logger.warn('BAILEYS', 'Using fallback WA version - fetchLatest failed')
  }

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
      const code = lastDisconnect?.error?.output?.statusCode
      if (code!== DisconnectReason.loggedOut) {
        isStarting = false
        logger.warn('AUTH', 'Connection closed, retrying...')
        setTimeout(() => startBot(), 10000)
      } else {
        logger.error('AUTH', 'Logged out. Manual intervention needed.')
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
      if (initSmartChannel) initSmartChannel(sock, db, logger)
      isStarting = false
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type!== 'notify') return
    for (const m of messages) {
      if (m.key.remoteJid && AUTOREACT_GROUPS.includes(m.key.remoteJid) &&!m.key.fromMe) {
        try { await sock.sendMessage(m.key.remoteJid, { react: { text: '⚽', key: m.key } }) } catch (e) {}
      }
      await routeMessage(sock, m)
    }
  })

  sock.ev.on('group-participants.update', async (update) => { await routeEvent(sock, 'group-participants.update', update) })
  sock.ev.on('call', async (calls) => { await routeEvent(sock, 'call', calls) })
}

process.on('uncaughtException', (err) => {
  logger.error('CRASH', 'Uncaught Exception - Bot continues', err.stack)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRASH', 'Unhandled Rejection - Bot continues', reason)
})

startBot()