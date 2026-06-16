/**
 * AstraX - router.js
 * 19-Way Owner Check & Zero-Restriction Routing.
 */

import { db } from './db.js'
import { logger } from './logger.js'

let commands = new Map()
let observers = new Map()

export function setCommands(cmds) { commands = cmds }
export function setObservers(obs) { observers = obs }

const REACT_KEYS = ['✅','❤️','🔥','💯','👍','😂','😍','🤔','👏','💀','⚡','✨','🌟','🎯','🚀','💎','👑','🌈','🎉','💪','🙏','😎','🥳','🤩','😇','🤗','😘','🤫','🤐','🤑','🤠','👻','👽','🤖','😺','🐶','🦁','🐯','🦄','🐸','🍕','🍔','🍟','🌮','🍩','🍪','🍭','🍯','🧃','☕']

export function getCommand(name) {
  const key = name.toLowerCase()
  if (commands.has(key)) return commands.get(key)
  for (const [_, cmd] of commands) {
    if (cmd.aliases && cmd.aliases.includes(key)) return cmd
  }
  return null
}

async function checkPermission(sock, m, cmd) {
  const from = m.key.remoteJid
  const owner = await db.get('owner')
  if (!owner) return { error: 'Bot owner not configured.' }

  const cleanJid = (jid) => jid?.split('@')[0]?.split(':')[0] || ''
  const botJid = sock.user?.id || ''
  const botClean = cleanJid(botJid)
  
  const isOwnerBot = 
    botClean === owner || 
    botJid.includes(owner) || 
    botClean.replace(/[^0-9]/g, '') === owner ||
    botJid.startsWith(`${owner}@`) ||
    botJid === `${owner}@s.whatsapp.net` ||
    botJid === `${owner}@lid`

  const mode = await db.get('mode') || 'public'
  if (mode === 'private' && !isOwnerBot) return false
  
  if (cmd.permissions >= 9 && !isOwnerBot) return { error: 'Owner only command.' }

  if (cmd.permissions >= 5 && from.endsWith('@g.us')) {
    const sender = m.key.participant || from
    try {
      const metadata = await sock.groupMetadata(from)
      const admin = metadata.participants.find(p => cleanJid(p.id) === cleanJid(sender) && p.admin)
      if (!admin && !isOwnerBot) return { error: 'Admin only command.' }
    } catch { return { error: 'Verification failed.' } }
  }

  return true
}

export async function routeMessage(sock, m) {
  try {
    if (!m.message || m.key.remoteJid === 'status@broadcast') return
    const from = m.key.remoteJid
    const sender = m.key.participant || from
    const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ''
    if (!body) return

    logger.incoming(from, sender.split('@')[0], body.slice(0, 30))

    for (const obs of observers.values()) {
      try { await obs.execute(sock, m, { db, logger }) } catch (e) {}
    }

    const [prefix, autoRead, autoTyping] = await Promise.all([
      db.get('prefix'), db.get('autoRead'), db.get('autoTyping')
    ])

    if (autoRead) try { await sock.readMessages([m.key]) } catch {}
    if (autoTyping) try { await sock.sendPresenceUpdate('composing', from) } catch {}

    const currentPrefix = prefix || '!'
    if (!body.startsWith(currentPrefix)) return

    const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
    const cmdName = parts[0].toLowerCase()
    const args = parts.slice(1)

    const cmd = getCommand(cmdName)
    if (!cmd) return

    const perm = await checkPermission(sock, m, cmd)
    if (perm !== true) {
      return await sock.sendMessage(from, { text: perm.error || 'Access Denied.' }, { quoted: m })
    }

    // Auto React
    try {
      const reactKey = REACT_KEYS[Math.floor(Math.random() * REACT_KEYS.length)]
      await sock.sendMessage(from, { react: { text: reactKey, key: m.key } })
    } catch {}

    logger.executed(cmd.name, sender.split('@')[0])
    try {
      await cmd.execute({ bot: { client: { sock }, db }, sock, msg: m, jid: from, sender, text: body, logger, pushName: m.pushName || 'User', prefix: currentPrefix, ...m }, args)
    } catch (e) {
      logger.error('CMD', `${cmd.name} crashed`, e.message)
      await sock.sendMessage(from, { text: `⚠️ Error: ${e.message}` }, { quoted: m })
    }
  } catch (e) { logger.error('ROUTER', 'Failed', e.message) }
}

export async function routeEvent(sock, name, update) {
  for (const obs of observers.values()) {
    if (obs.name === name) try { await obs.execute(sock, update, { db, logger }) } catch (e) {}
  }
}