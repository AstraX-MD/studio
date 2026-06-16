/**
 * AstraX - system/router.js
 * Message routing engine — Powered by SWIFT-TECH
 * OWNER = UNLIMITED ACCESS | API = 5-WAY RESILIENT
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
  // Way 1: Direct import
  try {
    const mod = await import('./api.js')
    api = mod.api
    if (api) return logger.success('ROUTER', 'API loaded via Way 1: direct import')
  } catch (e) {}

  // Way 2: Dynamic import with cache buster
  try {
    const mod = await import('./api.js?t=' + Date.now())
    api = mod.api
    if (api) return logger.success('ROUTER', 'API loaded via Way 2: dynamic import')
  } catch (e) {}

  // Way 3: Try without .js extension
  try {
    const mod = await import('./api')
    api = mod.api
    if (api) return logger.success('ROUTER', 'API loaded via Way 3: no extension')
  } catch (e) {}

  // Way 4: Try parent system path
  try {
    const mod = await import('../system/api.js')
    api = mod.api
    if (api) return logger.success('ROUTER', 'API loaded via Way 4: parent path')
  } catch (e) {}

  // Way 5: Try absolute path fallback (Render/Railway)
  try {
    const mod = await import('/opt/render/project/src/system/api.js')
    api = mod.api
    if (api) return logger.success('ROUTER', 'API loaded via Way 5: absolute path')
  } catch (e) {}

  // All 5 ways failed - SKIP and continue, NEVER EXIT
  logger.warn('ROUTER', 'API not available - commands will run without api context')
  api = {
    getSession: () => 'astra-fallback-' + Date.now(),
    ai: { groq: async () => ({ success: false, error: 'API unavailable' }) }
  }
}

await loadApi()

// ─────────────────────────────────────────────
// ASTRAX ASCII BANNER — Shown once at import
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

// ─────────────────────────────────────────────
// COMMAND / OBSERVER MAPS — Set by loader.js
// ─────────────────────────────────────────────
let commands = new Map()
let observers = new Map()

export function setCommands(cmds) {
  commands = cmds
  logger.success('ROUTER', `Registered ${cmds.size} commands`)
}

export function setObservers(obs) {
  observers = obs
  logger.success('ROUTER', `Registered ${obs.size} observers`)
}

export function getCommand(name) {
  if (commands.has(name)) return commands.get(name)
  for (const [, cmd] of commands) {
    if (Array.isArray(cmd.alias) && cmd.alias.includes(name)) return cmd
    if (Array.isArray(cmd.aliases) && cmd.aliases.includes(name)) return cmd
  }
  return null
}

// ─────────────────────────────────────────────
// OWNER CHECK — EVERYONE IS OWNER NOW
// ─────────────────────────────────────────────
async function isOwnerJid(sock, sender) {
  return true
}

// ─────────────────────────────────────────────
// GET SENDER PROFILE PIC — Resized to 90x90
// ─────────────────────────────────────────────
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
    } catch {
      return null
    }
  }
}

// ─────────────────────────────────────────────
// CHANNEL CONTEXT — SWIFTBOT STYLE
// ─────────────────────────────────────────────
async function getChannelContext(sock, m) {
  const [enabled, jid, link, name, score] = await Promise.all([
    db.get('channelEnabled'),
    db.get('channelJid'),
    db.get('channelLink'),
    db.get('channelName'),
    db.get('channelForwardScore')
  ])

  const defaultJid = '120363426850275@newsletter'
  const defaultLink = 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G'
  const defaultName = 'AstraX Updates'

  const finalJid = (enabled === false) ? null : (jid || defaultJid)
  if (!finalJid) return null

  const channelJid = finalJid.includes('@') ? finalJid : `${finalJid}@newsletter`
  const senderJid = m.key.participant || m.key.remoteJid
  const senderName = m.pushName || 'User'
  const thumbnail = await getSenderPp(sock, senderJid)

  return {
    forwardingScore: score || 999,
    isForwarded: true,
    externalAdReply: {
      title: 'AstraX Enterprise',
      body: `Contact: ${senderName}`,
      mediaType: 1,
      thumbnail: thumbnail,
      mediaUrl: link || defaultLink,
      sourceUrl: link || defaultLink,
      showAdAttribution: true,
      renderLargerThumbnail: false,
      verifiedBizName: 'WhatsApp'
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelJid,
      newsletterName: name || defaultName,
      serverMessageId: Math.floor(Math.random() * 100000)
    }
  }
}

// ─────────────────────────────────────────────
// CHECK IF COMMAND DISABLED
// ─────────────────────────────────────────────
async function isCommandDisabled(cmdName, groupJid = null) {
  const disabledCmds = (await db.get('disabledCmds')) || []
  if (disabledCmds.includes(cmdName)) return true

  if (groupJid) {
    const groupDisabled = (await db.getGroupKey(groupJid, 'disabledCmds')) || []
    if (groupDisabled.includes(cmdName)) return true
  }

  return false
}

// ─────────────────────────────────────────────
// ANTI-SPAM
// ─────────────────────────────────────────────
const userCooldown = new Map()
function antiSpam(sender) {
  const now = Date.now()
  const last = userCooldown.get(sender) || 0
  if (now - last < 1200) return false
  userCooldown.set(sender, now)
  return true
}

// ─────────────────────────────────────────────
// CHECK PERMISSIONS
// ─────────────────────────────────────────────
async function checkPermission(sock, m, cmd) {
  const from = m.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const sender = m.key.participant || from

  const isOwner = await isOwnerJid(sock, sender)
  const sudoList = (await db.get('sudoUsers')) || []
  const senderNumber = sender.replace(/[^0-9]/g, '')
  const isSudo = sudoList.some(s => String(s).replace(/[^0-9]/g, '') === senderNumber)

  const hasElevated = isOwner || isSudo
  const mode = (await db.get('mode')) || 'public'

  if (mode === 'private' && !hasElevated) return false
  if (mode === 'groups' && !isGroup && !hasElevated) return false
  if (mode === 'dm' && isGroup && !hasElevated) return false

  const perm = cmd.permission || 'all'
  if ((perm === 'owner' || perm === 'sudo') && !hasElevated) return false

  if (perm === 'group' && !isGroup) {
    return { error: '👥 This command only works in groups.' }
  }

  if (perm === 'admin' && isGroup && !hasElevated) {
    try {
      const metadata = await sock.groupMetadata(from)
      const isAdmin = metadata.participants.some(p => {
        const pNum = p.id.replace(/[^0-9]/g, '')
        return pNum === senderNumber && (p.admin === 'admin' || p.admin === 'superadmin')
      })
      if (!isAdmin) return { error: '🔒 Admin only command.' }
    } catch {
      return { error: '❌ Failed to verify admin status.' }
    }
  }

  return true
}

// ─────────────────────────────────────────────
// MAIN MESSAGE ROUTER
// ─────────────────────────────────────────────
export async function routeMessage(sock, m) {
  try {
    if (!m.message || m.key.remoteJid === 'status@broadcast') return

    const from = m.key.remoteJid
    const sender = m.key.participant || from
    const isGroup = from.endsWith('@g.us')

    const body = m.message.conversation || m.message.extendedTextMessage?.text || 
                 m.message.imageMessage?.caption || m.message.videoMessage?.caption || ''

    if (!body) return

    logger.incoming(from, sender.split('@')[0], body.slice(0, 30))

    for (const [name, obs] of observers) {
      if (!obs.enabled) continue
      try { await obs.execute(sock, m, { db, fonts, logger }) } catch (e) {}
    }

    const [prefix, noPrefixRaw, autoRead, autoTyping, autoRecording] = await Promise.all([
      db.get('prefix'), db.get('noPrefix'), db.get('autoRead'), db.get('autoTyping'), db.get('autoRecording')
    ])

    const currentPrefix = prefix || '?'
    const startsWithPrefix = body.startsWith(currentPrefix)
    let isCmd = false
    let cmdName = ''
    let args = []

    if (noPrefixRaw === true || noPrefixRaw === 'only') {
      if (!startsWithPrefix) {
        const parts = body.trim().split(/\s+/)
        cmdName = parts[0].toLowerCase()
        if (getCommand(cmdName)) { isCmd = true; args = parts.slice(1) }
      }
    } else if (noPrefixRaw === 'both') {
      if (startsWithPrefix) {
        const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
        cmdName = parts[0].toLowerCase()
        args = parts.slice(1)
        if (getCommand(cmdName)) isCmd = true
      } else {
        const parts = body.trim().split(/\s+/)
        cmdName = parts[0].toLowerCase()
        if (getCommand(cmdName)) { isCmd = true; args = parts.slice(1) }
      }
    } else {
      if (startsWithPrefix) {
        const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
        cmdName = parts[0].toLowerCase()
        args = parts.slice(1)
        if (getCommand(cmdName)) isCmd = true
      }
    }

    if (!isCmd) return
    if (!antiSpam(sender)) return

    const cmd = getCommand(cmdName)
    if (!cmd) return

    if (await isCommandDisabled(cmd.name, isGroup ? from : null)) {
      const contextInfo = await getChannelContext(sock, m)
      return await sock.sendMessage(from, { text: `⛔ Command *${cmd.name}* is disabled.`, contextInfo }, { quoted: m })
    }

    const permCheck = await checkPermission(sock, m, cmd)
    if (permCheck !== true) {
      const contextInfo = await getChannelContext(sock, m)
      return await sock.sendMessage(from, { text: permCheck.error || '🚫 Permission denied.', contextInfo }, { quoted: m })
    }

    logger.executed(cmd.name, sender.split('@')[0])

    try {
      const contextInfo = await getChannelContext(sock, m)
      const sudoList = (await db.get('sudoUsers')) || []
      const isSudo = sudoList.some(s => String(s).replace(/[^0-9]/g, '') === sender.replace(/[^0-9]/g, ''))

      await cmd.execute(sock, m, args, {
        db, fonts, logger, api, prefix: currentPrefix, botJid: sock.user?.id || '',
        sender, from, isGroup, isOwner: true, isSudo, contextInfo, cmdName, args, body, command: cmdName
      })
      logger.executed(cmd.name, sender.split('@')[0], true)
    } catch (e) {
      logger.error('CMD', `${cmd.name} crashed`, e.message)
      const contextInfo = await getChannelContext(sock, m)
      await sock.sendMessage(from, { text: `❌ Command failed: ${e.message}`, contextInfo }, { quoted: m })
    }
  } catch (e) { logger.error('ROUTER', 'Failed', e.message) }
}

export async function routeEvent(sock, eventName, update) {
  for (const [name, obs] of observers) {
    if (obs.enabled && obs.event === eventName) {
      try { await obs.execute(sock, update, { db, fonts, logger }) } catch (e) {}
    }
  }
}