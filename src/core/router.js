/**
 * AstraX - router.js
 * Elite message routing engine — Prefix logic, channel context, permissions
 * OWNER = PAIRING CODE NUMBER ONLY - NO SENDER CHECK
 */

import { db } from './db.js'
import { logger } from './logger.js'
import { box } from './box.js'
import { fonts } from './fonts.js'

let commands = new Map()
let observers = new Map()

export function setCommands(cmds) {
  commands = cmds
}

export function setObservers(obs) {
  observers = obs
}

export function getCommand(name) {
  if (commands.has(name)) return commands.get(name)
  for (const [_, cmd] of commands) {
    if (cmd.aliases && cmd.aliases.includes(name)) return cmd
  }
  return null
}

const REACT_KEYS = ['✅','❤️','🔥','💯','👍','😂','😍','🤔','👏','💀','⚡','✨','🌟','🎯','🚀','💎','👑','🌈','🎉','💪','🙏','😎','🥳','🤩','😇','🤗','😘','🤫','🤐','🤑','🤠','👻','👽','🤖','😺','🐶','🦁','🐯','🦄','🐸','🍕','🍔','🍟','🌮','🍩','🍪','🍭','🍯','🧃','☕']

async function getChannelContext() {
  const [enabled, removeads, jid, link, name, score] = await Promise.all([
    db.get('channelEnabled'),
    db.get('removeads'),
    db.get('channelJid'),
    db.get('channelLink'),
    db.get('channelName'),
    db.get('channelForwardScore')
  ])
  if (!enabled || !jid || removeads) return null
  return {
    forwardingScore: score || 430,
    isForwarded: true,
    externalAdReply: {
      title: 'WhatsApp',
      body: `Contact: ${name || 'AstraX Updates'}`,
      mediaType: 1,
      thumbnail: null,
      mediaUrl: link || '',
      sourceUrl: link || '',
      showAdAttribution: true,
      verifiedBizName: 'WhatsApp'
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: jid,
      newsletterName: name || 'AstraX Updates'
    }
  }
}

async function checkPermission(sock, m, cmd) {
  const from = m.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const owner = await db.get('owner')
  if (!owner) return { error: 'Bot owner not configured.' }

  const cleanJid = (jid) => jid?.split('@')[0]?.split(':')[0] || ''
  const botJid = sock.user?.id || ''
  const botClean = cleanJid(botJid)
  
  const isOwnerBot = botClean === owner || botJid.includes(owner) || botClean.replace(/[^0-9]/g, '') === owner

  const mode = await db.get('mode') || 'public'
  if (mode === 'private' && !isOwnerBot) return false
  if (mode === 'groups' && !isGroup && !isOwnerBot) return false
  if (mode === 'dm' && isGroup && !isOwnerBot) return false

  const perm = cmd.permissions || 1
  if (perm >= 9 && !isOwnerBot) return false

  if (perm >= 5 && isGroup) {
    const sender = m.key.participant || from
    const senderClean = cleanJid(sender)
    try {
      const metadata = await sock.groupMetadata(from)
      const admin = metadata.participants.find(p => cleanJid(p.id) === senderClean && p.admin)
      if (!admin && !isOwnerBot) return { error: 'Admin only command.' }
    } catch { return { error: 'Verification failed.' } }
  }

  return true
}

async function sendReact(sock, m) {
  try {
    const enabled = await db.get('reactEnabled')
    if (enabled === false) return
    const reactKey = REACT_KEYS[Math.floor(Math.random() * REACT_KEYS.length)]
    await sock.sendMessage(m.key.remoteJid, { react: { text: reactKey, key: m.key } })
  } catch (e) {}
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

    for (const obs of observers.values()) {
      try { await obs.execute(sock, m, { db, box, fonts, logger }) } catch (e) {}
    }

    const [prefix, noPrefix, autoRead, autoTyping, autoRecording] = await Promise.all([
      db.get('prefix'), db.get('noPrefix'), db.get('autoRead'), db.get('autoTyping'), db.get('autoRecording')
    ])

    if (autoRead) try { await sock.readMessages([m.key]) } catch {}
    if (autoTyping) try { await sock.sendPresenceUpdate('composing', from) } catch {}
    if (autoRecording) try { await sock.sendPresenceUpdate('recording', from) } catch {}

    let isCmd = false, cmdName = '', args = []
    const currentPrefix = prefix || '!'
    if (body.startsWith(currentPrefix)) {
      isCmd = true
      const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
      cmdName = parts[0].toLowerCase()
      args = parts.slice(1)
    } else if (noPrefix) {
      const parts = body.trim().split(/\s+/)
      if (getCommand(parts[0].toLowerCase())) {
        isCmd = true
        cmdName = parts[0].toLowerCase()
        args = parts.slice(1)
      }
    }

    if (!isCmd) return
    await sendReact(sock, m)
    const cmd = getCommand(cmdName)
    if (!cmd) return

    const permCheck = await checkPermission(sock, m, cmd)
    if (permCheck !== true) {
      const msg = await box.error(permCheck.error || 'Access Denied.')
      return await sock.sendMessage(from, { text: msg }, { quoted: m })
    }

    logger.executed(cmd.name, sender.split('@')[0])
    try {
      const contextInfo = await getChannelContext()
      await cmd.execute({ bot: { client: { sock }, db, managers: { settings: { get: async (c, k) => db.get(k) } } }, sock, msg: m, jid: from, sender, isGroup, text: body, ...m }, args)
    } catch (e) {
      logger.error('CMD', `${cmd.name} crashed`, e.message)
      await sock.sendMessage(from, { text: await box.error(`Command failed: ${e.message}`) }, { quoted: m })
    }
  } catch (e) { logger.error('ROUTER', 'Failed', e.message) }
}

export async function routeEvent(sock, eventName, update) {
  for (const obs of observers.values()) {
    if (obs.name === eventName) {
      try { await obs.execute(sock, update, { db, box, fonts, logger }) } catch (e) {}
    }
  }
}