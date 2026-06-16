/**
 * AstraX - system/router.js
 * Message routing engine — Prefix logic, channel context, permissions
 * All settings real-time from DB — no restart needed
 * OWNER CHECK — 100% UNRESTRICTED
 */

import { db } from './db.js'
import { logger } from './logger.js'
import sharp from 'sharp'
import nodeFetch from 'node-fetch'

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
console.log(`
\x1b[36m
   █████╗ ███████╗████████╗██████╗ █████╗ ██╗ ██╗
  ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚██╗██╔╝
  ███████║███████╗ ██║ ██████╔╝███████║ ╚███╔╝
  ██╔══██║╚════██║ ██║ ██╔══██╗██╔══██║ ██╔██╗
  ██║ ██║███████║ ██║ ██║ ██║██╔╝ ██╗
  ╚═╝ ╚═╝╚══════╝ ╚═╝╚═╝ ╚═╝╚═╝ ╚═╝
\x1b[0m\x1b[33m ⚡ AstraX Router — Powered by SWIFT-TECH\x1b[0m
\x1b[90m ─────────────────────────────────────────\x1b[0m
`)

let commands = new Map()
let observers = new Map()

export function setCommands(cmds) { commands = cmds; logger.success('ROUTER', `Registered ${cmds.size} commands`) }
export function setObservers(obs) { observers = obs; logger.success('ROUTER', `Registered ${obs.size} observers`) }

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
    const res = await nodeFetch(ppUrl)
    const buf = Buffer.from(await res.arrayBuffer())
    return await sharp(buf).resize(90, 90).jpeg({ quality: 80 }).toBuffer()
  } catch {
    try {
      const botimage = await db.get('botimage') || 'https://i.ibb.co/QvGY7dqB/file-00000e1107243ad54749c06fe2d80.png'
      const res = await nodeFetch(botimage)
      const buf = Buffer.from(await res.arrayBuffer())
      return await sharp(buf).resize(90, 90).jpeg({ quality: 80 }).toBuffer()
    } catch { return null }
  }
}

async function getChannelContext(sock, m) {
  const [enabled, jid, link, name, score] = await Promise.all([
    db.get('channelEnabled'), db.get('channelJid'), db.get('channelLink'), db.get('channelName'), db.get('channelForwardScore')
  ])
  const finalJid = (enabled === false) ? null : (jid || '120363426850275@newsletter')
  if (!finalJid) return null
  const channelJid = finalJid.includes('@') ? finalJid : `${finalJid}@newsletter`
  const senderJid = m.key.participant || m.key.remoteJid
  const thumbnail = await getSenderPp(sock, senderJid)
  return {
    forwardingScore: score || 999, isForwarded: true,
    externalAdReply: {
      title: 'WhatsApp', body: `Contact: ${m.pushName || 'User'}`, mediaType: 1,
      thumbnail: thumbnail, mediaUrl: link || '', sourceUrl: link || '',
      showAdAttribution: true, renderLargerThumbnail: false, verifiedBizName: 'WhatsApp'
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelJid, newsletterName: name || 'AstraX Updates', serverMessageId: Math.floor(Math.random() * 100000)
    }
  }
}

async function checkPermission(sock, m, cmd) {
  const from = m.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const sender = m.key.participant || from
  const hasElevated = true // Everyone is owner for this deployment

  const mode = (await db.get('mode')) || 'public'
  if (mode === 'private' && !hasElevated) return false
  if (mode === 'groups' && !isGroup && !hasElevated) return false
  if (mode === 'dm' && isGroup && !hasElevated) return false

  const perm = cmd.permission || 'all'
  if ((perm === 'owner' || perm === 'sudo') && !hasElevated) return false
  if (perm === 'group' && !isGroup) return { error: '👥 This command only works in groups.' }
  
  if (perm === 'admin' && isGroup) {
    try {
      const metadata = await sock.groupMetadata(from)
      const senderNum = sender.replace(/[^0-9]/g, '')
      const isAdmin = metadata.participants.some(p => p.id.replace(/[^0-9]/g, '') === senderNum && (p.admin === 'admin' || p.admin === 'superadmin'))
      if (!isAdmin) return { error: '🔒 Admin only command.' }
    } catch { return { error: '❌ Failed to verify admin status.' } }
  }
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
      if (obs.enabled) try { await obs.execute(sock, m, { db, logger }) } catch (e) {}
    }

    const [prefix, noPrefixRaw, autoRead, autoTyping, autoRecording] = await Promise.all([
      db.get('prefix'), db.get('noPrefix'), db.get('autoRead'), db.get('autoTyping'), db.get('autoRecording')
    ])

    const currentPrefix = prefix || '?'
    const startsWithPrefix = body.startsWith(currentPrefix)
    let isCmd = false, cmdName = '', args = []

    if (noPrefixRaw === true || noPrefixRaw === 'both') {
      if (startsWithPrefix) {
        const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
        cmdName = parts[0].toLowerCase(); args = parts.slice(1)
        if (getCommand(cmdName)) isCmd = true
      } else {
        const parts = body.trim().split(/\s+/)
        cmdName = parts[0].toLowerCase()
        if (getCommand(cmdName)) { isCmd = true; args = parts.slice(1) }
      }
    } else {
      if (startsWithPrefix) {
        const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
        cmdName = parts[0].toLowerCase(); args = parts.slice(1)
        if (getCommand(cmdName)) isCmd = true
      }
    }

    if (!isCmd) return
    const cmd = getCommand(cmdName)
    if (!cmd) return

    const permCheck = await checkPermission(sock, m, cmd)
    if (permCheck !== true) {
      const contextInfo = await getChannelContext(sock, m)
      return await sock.sendMessage(from, { text: permCheck.error || '🚫 Access Denied.', contextInfo }, { quoted: m })
    }

    logger.executed(cmd.name, sender.split('@')[0])
    try {
      const contextInfo = await getChannelContext(sock, m)
      await cmd.execute(sock, m, args, { db, logger, api, prefix: currentPrefix, botJid: sock.user?.id || '', sender, from, isGroup, isOwner: true, contextInfo, cmdName, args, body, command: cmdName })
      logger.executed(cmd.name, sender.split('@')[0], true)
    } catch (e) {
      logger.error('CMD', `${cmd.name} crashed`, e.message)
      const contextInfo = await getChannelContext(sock, m)
      await sock.sendMessage(from, { text: `❌ Command failed: ${e.message}`, contextInfo }, { quoted: m })
    }
  } catch (e) { logger.error('ROUTER', 'Failed', e.message) }
}

export async function routeEvent(sock, name, update) {
  for (const [n, obs] of observers) {
    if (obs.enabled && obs.event === name) try { await obs.execute(sock, update, { db, logger }) } catch (e) {}
  }
}
