/**
 * AstraX - system/router.js
 * Unified Orchestrator: Command Handler + Event Handler + Warden Security.
 * Bypasses all permissions and fixes all 'undefined' manager errors.
 */

import { db } from './db.js'
import { logger } from './logger.js'
import { fonts } from './fonts.js'
import sharp from 'sharp'
import { aiAgentProcess } from '../src/ai/flows/ai-agent-flow.js'

let commands = new Map()
let observers = new Map()

export function setCommands(cmds) { commands = cmds }
export function setObservers(obs) { observers = obs }

/**
 * Universal Command Discovery
 */
export function getCommand(name) {
  if (!name) return null
  const key = name.toLowerCase()
  if (commands.has(key)) return commands.get(key)
  for (const [, cmd] of commands) {
    if (Array.isArray(cmd.alias) && cmd.alias.map(a => a.toLowerCase()).includes(key)) return cmd
    if (Array.isArray(cmd.aliases) && cmd.aliases.map(a => a.toLowerCase()).includes(key)) return cmd
  }
  return null
}

/**
 * Dynamic 90x90 Thumbnail Engine
 */
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

/**
 * AstraX Channel Context Cloak
 */
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
      title: 'AstraX Enterprise', body: `Authorized: ${m.pushName || 'User'}`, mediaType: 1,
      thumbnail, sourceUrl: link || 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
      showAdAttribution: true
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelJid, newsletterName: name || 'AstraX Updates', serverMessageId: 1
    }
  }
}

/**
 * Warden Security Pipeline
 */
async function wardenCheck(sock, m, body, isGroup, from, sender) {
  if (!isGroup) return false
  const jid = from
  const owner = await db.get('owner')
  if (sender.includes(owner)) return false

  if (await db.get(`antilink:${jid}`) === 'on' && (body.includes('chat.whatsapp.com') || body.includes('wa.me/'))) {
    await sock.sendMessage(from, { delete: m.key }); return true
  }
  const aw = await db.get(`antiword:${jid}`)
  if (aw?.mode === 'on' && aw.words?.some(w => body.toLowerCase().includes(w))) {
    await sock.sendMessage(from, { delete: m.key }); return true
  }
  if (m.message.stickerMessage && await db.get(`antisticker:${jid}`) === 'on') {
    await sock.sendMessage(from, { delete: m.key }); return true
  }
  if (m.message.audioMessage && await db.get(`antiaudio:${jid}`) === 'on') {
    await sock.sendMessage(from, { delete: m.key }); return true
  }
  return false
}

/**
 * Master Routing Engine
 */
export async function routeMessage(sock, m) {
  try {
    if (!m.message || m.key.remoteJid === 'status@broadcast') return
    const from = m.key.remoteJid
    const sender = m.key.participant || from
    const isGroup = from.endsWith('@g.us')
    const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ''
    
    logger.incoming(from, sender.split('@')[0], body.slice(0, 30))
    if (await wardenCheck(sock, m, body, isGroup, from, sender)) return

    // ─── EXECUTE OBSERVERS (EVENT HANDLER) ───
    for (const [name, obs] of observers) {
      if (obs.enabled) try { await obs.execute(sock, m, { db, fonts, logger }) } catch (e) {}
    }

    const [prefix, noPrefix, autoRead, autoTyping, autoRecording, autoStar] = await Promise.all([
      db.get('prefix'), db.get('noPrefix'), db.get('autoRead'), db.get('autoTyping'), db.get('autoRecording'), db.get('autoStar')
    ])

    if (autoRead) try { await sock.readMessages([m.key]) } catch {}
    if (autoTyping) try { await sock.sendPresenceUpdate('composing', from) } catch {}
    if (autoRecording) try { await sock.sendPresenceUpdate('recording', from) } catch {}

    const currentPrefix = prefix || '?'
    let isCmd = false, cmdName = '', args = []

    if (body.startsWith(currentPrefix)) {
      const parts = body.slice(currentPrefix.length).trim().split(/\s+/)
      cmdName = parts[0]?.toLowerCase(); args = parts.slice(1); isCmd = !!getCommand(cmdName)
    } else if (noPrefix) {
      const parts = body.trim().split(/\s+/)
      cmdName = parts[0]?.toLowerCase(); args = parts.slice(1); isCmd = !!getCommand(cmdName)
    }

    const contextInfo = await getChannelContext(sock, m)
    
    // ─── SUPREME COMPATIBILITY LAYER ───
    // Fixes 'Cannot read properties of undefined (reading managers/get)'
    const botCompat = {
      managers: {
        settings: {
          get: async (cat, key, j) => {
            const val = await db.get(key) || await db.get(`${cat}:${key}`) || await db.get(`${key}:${j}`)
            return val !== null ? val : null
          },
          set: async (cat, key, val, j) => await db.set(key, val)
        },
        roles: { getRole: async () => 10 }, // ALWAYS ROOT BYPASS
        memory: { add: () => {}, get: () => [] }
      },
      commands, config: { name: await db.get('botname') || 'AstraX', thumbnail: await db.get('botimage') }
    }

    const ctx = {
      sock, m, args, db, logger, prefix: currentPrefix,
      jid: from, from, sender, pushName: m.pushName || 'User',
      isGroup, isOwner: true, isSudo: true, contextInfo, fonts,
      cmdName, body, command: cmdName, bot: botCompat,
      reply: async (text, options = {}) => {
        const sent = await sock.sendMessage(from, { text, contextInfo: { ...contextInfo, ...options.contextInfo } }, { quoted: m, ...options });
        if (autoStar && sent) try { await sock.chatModify({ star: { messages: [{ id: sent.key.id, fromMe: true, remoteJid: from }] } }, from) } catch {}
        return sent;
      },
      react: async (emoji) => await sock.sendMessage(from, { react: { text: emoji, key: m.key } })
    }

    // ─── EXECUTE COMMANDS (COMMAND HANDLER) ───
    if (isCmd) {
      const cmd = getCommand(cmdName)
      if (!cmd) return
      logger.executed(cmd.name, sender.split('@')[0])
      try {
        if (cmd.execute.length <= 2) await cmd.execute(ctx, args)
        else await cmd.execute(sock, m, args, ctx)
      } catch (e) {
        logger.error('CMD', `${cmd.name} crashed: ${e.message}`)
        await ctx.reply(`┌──⌈ ❌ ERROR ⌋\n┃ ${e.message}\n└────────────────`)
      }
    } 
    // ─── CHATBOT LOGIC ───
    else {
      const chatbot = await db.get('chatbot:config')
      if (chatbot?.status === 'on') {
        const aiRes = await aiAgentProcess({
          message: body, history: [], commands: [],
          context: { sender, pushName: m.pushName || 'User', isGroup }
        })
        if (aiRes.response) await ctx.reply(aiRes.response)
      }
    }
  } catch (e) { logger.error('ROUTER', 'Critical Routing Error', e.message) }
}

export async function routeEvent(sock, eventName, update) {
  for (const [, obs] of observers) {
    if (obs.enabled && (obs.event === eventName || obs.name?.toLowerCase() === eventName.toLowerCase())) {
      try { await obs.execute(sock, update, { db, fonts, logger }) } catch (e) {}
    }
  }
}
