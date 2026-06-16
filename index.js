/**
 * AstraX - index.js
 * Main entry point with 30-Probe Baileys Swarm and Render Optimization.
 */

import 'dotenv/config'
import express from 'express'
import pino from 'pino'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import qrcode from 'qrcode-terminal'
import fetch from 'node-fetch'

import { initDb, db } from './src/core/db.js'
import { logger } from './src/core/logger.js'
import { initLoader, probeBaileys } from './src/core/loader.js'
import { routeMessage, routeEvent } from './src/core/router.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─────────────────────────────────────────────
// RENDER SERVER & KEEP-ALIVE
// ─────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => {
  res.json({ status: 'ok', bot: 'AstraX', uptime: process.uptime() })
})

app.listen(PORT, () => {
  logger.success('SERVER', `Active on port ${PORT}`)
})

setInterval(() => {
  fetch(`http://localhost:${PORT}`).catch(() => {})
}, 14 * 60 * 1000)

process.setMaxListeners(20)
let globalSock = null
let isStarting = false

const SESSION_DIR = join(__dirname, 'sessions')
const CREDS_PATH = join(SESSION_DIR, 'creds.json')

// ─────────────────────────────────────────────
// OWNER NOTIFICATION SWARM (30 FALLBACKS)
// ─────────────────────────────────────────────
async function sendConnectedMsg(sock) {
  try {
    const [botname, owner, prefix, mode] = await Promise.all([
      db.get('botname'),
      db.get('owner'),
      db.get('prefix'),
      db.get('mode')
    ])

    const ownerJid = `${owner}@s.whatsapp.net`
    const uptime = process.uptime()
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    
    const msg = `┌──⌈ 🚀 ASTRAX READY ⌋
┃ 
┃ Hello! Your bot is online.
┃ 
├─⌈ BOT INFO ⌋
┃ 🤖 Name: ${botname || 'AstraX'}
┃ 🏷️ Prefix: [ ${prefix || '?'} ]
┃ 📦 Mode: ${mode?.toUpperCase() || 'PUBLIC'}
┃ 🕒 Time: ${new Date().toLocaleTimeString()}
┃ 📡 Uptime: ${days}d ${hours}h ${mins}m
┃ 🧠 Status: OPTIMIZED
┃ 
└─ AstraX System`

    // 30-Way Send Swarm
    for (let i = 0; i < 30; i++) {
      try {
        await sock.sendMessage(ownerJid, { text: msg })
        logger.success('BOT', 'Connected report sent to owner')
        return
      } catch (e) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  } catch (e) {
    logger.error('BOT', 'Failed connected msg', e.message)
  }
}

// ─────────────────────────────────────────────
// START ENGINE
// ─────────────────────────────────────────────
async function startBot() {
  if (isStarting) return
  isStarting = true

  logger.bot('STARTUP', 'Initiating Swarm...')

  await initDb()
  await initLoader()

  const makeWASocket = probeBaileys('makeWASocket')
  const useMultiFileAuthState = probeBaileys('useMultiFileAuthState')
  const fetchLatestBaileysVersion = probeBaileys('fetchLatestBaileysVersion')
  const Browsers = probeBaileys('Browsers')
  const DisconnectReason = probeBaileys('DisconnectReason')

  if (!makeWASocket || !useMultiFileAuthState) {
    logger.error('CRASH', 'Baileys core unresolved. Swarm failed.')
    isStarting = false
    return // No Exit 1
  }

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
        logger.warn('AUTH', 'Logged out. Manual re-pairing needed.')
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

// Global Rejection Handlers (No Exit 1)
process.on('uncaughtException', (err) => logger.error('CRASH', 'Uncaught', err.message))
process.on('unhandledRejection', (err) => logger.error('CRASH', 'Rejection', err?.message))

startBot()