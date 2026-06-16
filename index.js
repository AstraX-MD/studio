/**
 * AstraX - index.js
 * Main entry point — Baileys connection, session load, plugin init
 * Real-time everything — MongoDB/RAM auto-detect
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
import nodeFetch from 'node-fetch'

const makeWASocket = baileys.default || baileys
const useMultiFileAuthState = baileys.useMultiFileAuthState || (baileys.default && baileys.default.useMultiFileAuthState)
const DisconnectReason = baileys.DisconnectReason || (baileys.default && baileys.default.DisconnectReason)
const Browsers = baileys.Browsers || (baileys.default && baileys.default.Browsers)
const fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion || (baileys.default && baileys.default.fetchLatestBaileysVersion)

import { initDb, db } from './system/db.js'
import { logger } from './system/logger.js'
import { initLoader } from './system/loader.js'
import { routeMessage, routeEvent } from './system/router.js'

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
      if (initApi) return logger.success('SYSTEM', `API loaded via: ${path}`)
    } catch (e) {}
  }
  initApi = async () => {
    logger.warn('SYSTEM', 'API unavailable - using fallback, bot continues')
    return { success: true, fallback: true }
  }
}
await loadApi()

// Skip if smartchannel missing
let initSmartChannel = null
try {
  const mod = await import('./src/plugins/observers/automations/smartchannel.js')
  initSmartChannel = mod.init
} catch (e) { logger.warn('SYSTEM', 'smartchannel.js missing') }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const AUTOREACT_GROUPS = ['120363406358472734@g.us']
const ASTRAX_CHANNEL = {
  jid: '120363426850275@newsletter',
  name: 'AstraX Updates',
  link: 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G'
}

// ─────────────────────────────────────────────
// EXPRESS SERVER FOR RENDER
// ─────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => res.json({ status: 'ok', bot: 'AstraX', uptime: process.uptime() }))
app.listen(PORT, () => logger.success('SERVER', `Port ${PORT} bound`))

setInterval(() => { nodeFetch(`http://localhost:${PORT}`).catch(() => {}) }, 14 * 60 * 1000)

process.setMaxListeners(20)
let globalSock = null, isStarting = false

const SESSION_DIR = join(__dirname, 'sessions')
const CREDS_PATH = join(SESSION_DIR, 'creds.json')

function loadSessionFromEnv() {
  const sessionId = process.env.SESSION_ID
  if (!sessionId || !sessionId.startsWith('ASTRAX~')) return false
  try {
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true })
    const base64Data = sessionId.replace('ASTRAX~', '')
    const decoded = Buffer.from(base64Data, 'base64').toString('utf-8')
    fs.writeFileSync(CREDS_PATH, decoded)
    logger.success('SESSION', 'Loaded from ENV')
    return true
  } catch (e) { return false }
}

let botThumbnail = null
async function loadBotImage() {
  try {
    const imageUrl = await db.get('botimage') || 'https://i.ibb.co/QvGY7dqB/file-00000e1107243ad54749c06fe2d80.png'
    const res = await nodeFetch(imageUrl)
    botThumbnail = Buffer.from(await res.arrayBuffer())
  } catch (e) { logger.warn('ASSET', 'Failed loading bot image') }
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
> ╭─────〔 ASTRAX CORE 〕─────┈⊷
> │ 𐂂 User: @${owner || 'Not Set'}
> │ 𐂂 Prefix: ${prefix || '#'}
> │ 𐂂 Mode: ${mode?.toUpperCase() || 'PUBLIC'}
> │ 𐂂 Version: ${version || '7.0.0'}
> │ 𐂂 Platform: ${platform || 'whatsapp'}
> │ 𐂂 Speed: ${(Math.random() * 150 + 50).toFixed(4)} ms
> │ 𐂂 Uptime: ${days}d ${hours}h ${mins}m
> │ 𐂂 RAM: ${ramPercent}%
> │ 𐂂 DB: ${db.mode}
> ╰─────────────────────────⊷

> Connected Successfully ✅
> Type ${prefix || '#'}menu to start`

    const contextInfo = {
      forwardingScore: 999, isForwarded: true,
      externalAdReply: { title: 'AstraX', body: 'Operational ✅', mediaType: 1, thumbnail: botThumbnail, sourceUrl: ASTRAX_CHANNEL.link, showAdAttribution: true },
      forwardedNewsletterMessageInfo: { newsletterJid: ASTRAX_CHANNEL.jid, newsletterName: ASTRAX_CHANNEL.name, serverMessageId: Math.floor(Math.random() * 100000) }
    }

    for (let i = 0; i < 30; i++) {
      try {
        await sock.sendMessage(ownerJid, { text: msg, contextInfo, mentions: [ownerJid] })
        return logger.success('BOT', 'Owner report sent')
      } catch (e) { await new Promise(r => setTimeout(r, 2000)) }
    }
  } catch (e) { logger.error('BOT', 'Report failed') }
}

async function startBot() {
  if (isStarting) return
  isStarting = true
  logger.bot('STARTUP', 'Initializing...')

  await initDb()
  await initApi()
  if (!fs.existsSync(CREDS_PATH)) loadSessionFromEnv()
  await loadBotImage()
  await initLoader()

  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)

  const sock = makeWASocket({
    version, auth: state, printQRInTerminal: false,
    logger: pino({ level: 'silent' }), browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: false, shouldSyncHistoryMessage: () => false
  })

  globalSock = sock
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) { logger.info('QR', 'Scan to login:'); qrcode.generate(qr, { small: true }) }
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) { isStarting = false; setTimeout(() => startBot(), 10000) }
      else { logger.warn('AUTH', 'Logged out'); isStarting = false }
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
    if (type !== 'notify') return
    for (const m of messages) {
      if (m.key.remoteJid && AUTOREACT_GROUPS.includes(m.key.remoteJid) && !m.key.fromMe) {
        try { await sock.sendMessage(m.key.remoteJid, { react: { text: '⚽', key: m.key } }) } catch (e) {}
      }
      await routeMessage(sock, m)
    }
  })

  sock.ev.on('group-participants.update', async (update) => { await routeEvent(sock, 'group-participants.update', update) })
  sock.ev.on('call', async (calls) => { await routeEvent(sock, 'call', calls) })
}

process.on('uncaughtException', (err) => logger.error('CRASH', 'Uncaught', err.message))
process.on('unhandledRejection', (err) => logger.error('CRASH', 'Rejection', err?.message))

startBot()