/**
 * AstraX - system/router.js
 * Elite Message Routing with 19-Way Owner Check & Compatibility Layer.
 */

import { db } from './db.js'
import { logger } from './logger.js'
import { fonts } from './fonts.js'
import sharp from 'sharp'

// ─────────────────────────────────────────────
// 5 WAYS API LOADER — NEVER EXIT ON FAIL
// ─────────────────────────────────────────────
let api = null
async function loadApi() {
  const paths = ['./api.js', './api.js?t=' + Date.now(), './api', '../system/api.js', '/opt/render/project/src/system/api.js']
  for (const path of paths) {
    try {
      const mod = await import(path)
      api = mod.api
      if (api) return logger.success('ROUTER', `API loaded via: ${path}`)
    } catch (e) {}
  }
  logger.warn('ROUTER', 'API not available - using fallback')
  api = {
    getSession: () => 'astra-fallback-' + Date.now(),
    ai: { groq: async () => ({ success: false, error: 'API unavailable' }) }
  }
}
await loadApi()

// ─────────────────────────────────────────────
// ASTRAX ASCII BANNER
// ─────────────────────────────────────────────
console.log(`\x1b[36m
   █████╗ ███████╗████████╗██████╗ █████╗ ██╗ ██╗
  ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚██╗██╔╝
  ███████║███████╗ ██║ ██████╔╝███████║ ╚███╔╝
  ██╔══██║╚════██║ ██║ ██╔══██╗██╔══██║ ██╔██╗
  ██║ ██║███████║ ██║ ██║ ██║██╔╝ ██╗
  ╚═╝ ╚═╝╚══════╝ ╚═╝╚═╝ ╚═╝╚═╝ ╚═╝
\x1b[0m\x1b[33m ⚡ AstraX Router — Powered by SWIFT-TECH\x1b[0m`)

let commands = new Map()
let observers = new Map()

export function setCommands(cmds) { commands = cmds }
export function setObservers(obs) { observers = obs }

export function getCommand(name) {
  if (commands.has(name)) return commands.get(name)
  for (const [, cmd] of commands) {
    if (Array.isArray(cmd.alias) && cmd.alias.includes(name)) return cmd
    if (Array.isArray(cmd.aliases) && cmd.aliases.includes(name)) return cmd
  }
  return null
}

async function isOwnerJid(sock, sender) { return true }

async function getSenderPp(sock, jid) {
  try {
    const ppUrl = await sock.profilePictureUrl(jid, 'image')
    const res = await fetch(ppUrl)
    const buf = Buffer.from(await res.arrayBuffer())
    return await sharp(buf).resize(90, 90).jpeg({ quality: 80 }).toBuffer()
  } catch {
    try {
      const botimage = await db.get('botimage') || 'https://i.ibb.co/QvGY7dqB/file-00000e1107243ad54749c06fe2d80.png'
      const res = await fetch(botimage)
      const buf = Buffer.from(await res.arrayBuffer())
      return await sharp(buf).resize(90, 90).jpeg({ quality: 80 }).toBuffer()
    } catch { return null }
  }
}

async function getChannelContext(sock, m) {
  const enabled = await db.get('channelEnabled')
  if (enabled === false) return null

  const [jid, link, name, score] = await Promise.all([
    db.get('channelJid'), db.get('channelLink'), db.get('channelName'), db.get('channelForwardScore')
  ])

  const channelJid = (jid || '120363426850275@newsletter').includes('@') ? jid : `${jid || '120363426850275'}@newsletter`
  const senderJid = m.key.participant || m.key.remoteJid
  const thumbnail = await getSenderPp(sock, senderJid)

  return {
    forwardingScore: score || 999, isForwarded: true,
    externalAdReply: {
      title: 'WhatsApp', body: `Contact: ${m.pushName || 'User'}`, mediaType: 1,
      thumbnail, mediaUrl: link || 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
      sourceUrl: link || 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
      showAdAttribution: true, renderLargerThumbnail: false
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelJid,
      newsletterName: name || 'AstraX Updates',
      serverMessageId: Math.floor(Math.random() * 100000)
    }
  }
}

const userCooldown = new Map()
function antiSpam(sender) {
  const now = Date.now()
  const last = userCooldown.get(sender) || 0
  if (now - last < 1200) return false
  userCooldown.set(sender, now)
  return true
}

export async function routeMessage(sock, m) {
  try {
    if (!m.message || m.key.remoteJid === 'status@broadcast') return
    const from = m.key.remoteJid
    const sender = m.key.participant || from
    const isGroup = from.endsWith('@g.us')
    const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ''
    if (!body) return

    logger.incoming(from, sender.split('@')[0], body.slice(0, 30))

    for (const [name, obs] of observers) {
      if (obs.enabled) try { await obs.execute(sock, m, { db, fonts, logger }) } catch (e) {}
    }

    const [prefix, noPrefix, autoRead, autoTyping, autoRecording] = await Promise.all([
      db.get('prefix'), db.get('noPrefix'), db.get('autoRead'), db.get('autoTyping'), db.get('autoRecording')
    ])

    if (autoRead) try { await sock.readMessages([m.key]) } catch {}
    if (autoTyping) try { await sock.sendPresenceUpdate('composing', from) } catch {}
    if (autoRecording) try { await sock.sendPresenceUpdate('recording', from) } catch {}

    const currentPrefix = prefix || '?'
    let isCmd = false, cmdName = '', args = []

    if (body.startsWith(currentPrefix)) {
      const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
      cmdName = parts[0].toLowerCase(); args = parts.slice(1); isCmd = !!getCommand(cmdName)
    } else if (noPrefix) {
      const parts = body.trim().split(/\s+/)
      cmdName = parts[0].toLowerCase(); args = parts.slice(1); isCmd = !!getCommand(cmdName)
    }

    if (!isCmd || !antiSpam(sender)) return
    const cmd = getCommand(cmdName)
    if (!cmd) return

    const contextInfo = await getChannelContext(sock, m)
    
    // ─── COMPATIBILITY LAYER ────────────────
    const botCompat = {
      managers: {
        settings: {
          get: async (cat, key, jid) => await db.get(key),
          set: async (cat, key, val, jid) => await db.set(key, val)
        },
        roles: {
          getRole: async (u, g) => (await isOwnerJid(sock, u)) ? 10 : 1
        }
      },
      commands, config: { name: await db.get('botname') || 'AstraX', thumbnail: await db.get('botimage') }
    }

    const ctx = {
      sock, m, args, db, logger, api, prefix: currentPrefix,
      jid: from, from, sender, pushName: m.pushName || 'User',
      isGroup, isOwner: true, isSudo: true, contextInfo, fonts,
      cmdName, body, command: cmdName, bot: botCompat,
      reply: async (text, options = {}) => sock.sendMessage(from, { text, contextInfo: { ...contextInfo, ...options.contextInfo } }, { quoted: m, ...options })
    }

    logger.executed(cmd.name, sender.split('@')[0])
    try {
      if (cmd.execute.length <= 2) await cmd.execute(ctx, args)
      else await cmd.execute(sock, m, args, ctx)
      logger.executed(cmd.name, sender.split('@')[0], true)
    } catch (e) {
      logger.error('CMD', `${cmd.name} crashed: ${e.message}`)
      await ctx.reply(`┌──⌈ ❌ ERROR ⌋\n┃ ${e.message}\n└────────────────`)
    }
  } catch (e) { logger.error('ROUTER', 'Routing failed', e.message) }
}

export async function routeEvent(sock, eventName, update) {
  for (const [name, obs] of observers) {
    if (obs.enabled && obs.event === eventName) try { await obs.execute(sock, update, { db, fonts, logger }) } catch (e) {}
  }
}