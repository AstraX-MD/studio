/**
 * AstraX - system/router.js
 * Elite Message Routing with Warden Security, Chatbot, and Compatibility Layer.
 */

import { db } from './db.js'
import { logger } from './logger.js'
import { fonts } from './fonts.js'
import sharp from 'sharp'
import { aiAgentProcess } from '../src/ai/flows/ai-agent-flow.js'

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
      title: 'AstraX Enterprise', body: `Authorized: ${m.pushName || 'User'}`, mediaType: 1,
      thumbnail, sourceUrl: link || 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
      showAdAttribution: true
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelJid, newsletterName: name || 'AstraX Updates', serverMessageId: 1
    }
  }
}

// ─────────────────────────────────────────────
// WARDEN SECURITY CHECKS
// ─────────────────────────────────────────────
async function wardenCheck(sock, m, body, isGroup, from, sender) {
  if (!isGroup) return false
  const jid = from
  const metadata = await sock.groupMetadata(jid)
  const isSenderAdmin = metadata.participants.find(p => p.id === sender)?.admin
  if (isSenderAdmin) return false

  // Anti-Link
  const antilink = await db.get(`antilink:${jid}`)
  if (antilink?.mode === 'on' && (body.includes('chat.whatsapp.com') || body.includes('wa.me/'))) {
    await sock.sendMessage(from, { delete: m.key })
    if (antilink.action === 'kick') await sock.groupParticipantsUpdate(from, [sender], 'remove')
    return true
  }

  // Anti-Badword
  const antiword = await db.get(`antiword:${jid}`)
  if (antiword?.mode === 'on') {
    const hasBadWord = antiword.words.some(word => body.toLowerCase().includes(word))
    if (hasBadWord) {
      await sock.sendMessage(from, { delete: m.key })
      return true
    }
  }

  // Media Antis
  if (m.message.stickerMessage) {
    const as = await db.get(`antisticker:${jid}`)
    if (as?.mode === 'on') return await sock.sendMessage(from, { delete: m.key })
  }
  if (m.message.audioMessage) {
    const aa = await db.get(`antiaudio:${jid}`)
    if (aa?.mode === 'on') return await sock.sendMessage(from, { delete: m.key })
  }
  if (m.message.videoMessage) {
    const av = await db.get(`antivideo:${jid}`)
    if (av?.mode === 'on') return await sock.sendMessage(from, { delete: m.key })
  }

  return false
}

export async function routeMessage(sock, m) {
  try {
    if (!m.message || m.key.remoteJid === 'status@broadcast') return
    const from = m.key.remoteJid
    const sender = m.key.participant || from
    const isGroup = from.endsWith('@g.us')
    const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ''
    
    // 1. Log Incoming
    logger.incoming(from, sender.split('@')[0], body.slice(0, 30))

    // 2. Warden Guard
    if (await wardenCheck(sock, m, body, isGroup, from, sender)) return

    // 3. Observers
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
      cmdName = parts[0].toLowerCase(); args = parts.slice(1); isCmd = !!getCommand(cmdName)
    } else if (noPrefix) {
      const parts = body.trim().split(/\s+/)
      cmdName = parts[0].toLowerCase(); args = parts.slice(1); isCmd = !!getCommand(cmdName)
    }

    const contextInfo = await getChannelContext(sock, m)
    
    // ─── COMPATIBILITY LAYER ────────────────
    const botCompat = {
      managers: {
        settings: {
          get: async (cat, key, j) => await db.get(key) || await db.get(`${cat}:${key}`) || await db.get(`${key}:${j}`),
          set: async (cat, key, val, j) => await db.set(key, val)
        },
        roles: { getRole: async (u, g) => 10 },
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
        if (autoStar && sent) await sock.chatModify({ star: { messages: [{ id: sent.key.id, fromMe: true, remoteJid: from }] } }, from).catch(() => {});
        return sent;
      },
      react: async (emoji) => await sock.sendMessage(from, { react: { text: emoji, key: m.key } })
    }

    // 4. Command Execution
    if (isCmd) {
      const cmd = getCommand(cmdName)
      logger.executed(cmd.name, sender.split('@')[0])
      try {
        if (cmd.execute.length <= 2) await cmd.execute(ctx, args)
        else await cmd.execute(sock, m, args, ctx)
      } catch (e) {
        logger.error('CMD', `${cmd.name} crashed: ${e.message}`)
        await ctx.reply(`┌──⌈ ❌ ERROR ⌋\n┃ ${e.message}\n└────────────────`)
      }
    } 
    // 5. Chatbot Autonomous Logic
    else {
      const chatbot = await db.get('chatbot:config')
      if (chatbot?.status === 'on') {
        const canReply = chatbot.mode === 'public' || 
                         (chatbot.mode === 'dm' && !isGroup) || 
                         (chatbot.mode === 'groups' && isGroup) ||
                         (chatbot.mode === 'whitelist' && chatbot.whitelist.includes(sender));
        
        if (canReply) {
          const aiRes = await aiAgentProcess({
            message: body,
            history: [],
            commands: [],
            context: { sender, pushName: m.pushName || 'User', isGroup }
          })
          if (aiRes.response) await ctx.reply(aiRes.response)
        }
      }
    }
  } catch (e) { logger.error('ROUTER', 'Routing failed', e.message) }
}

export async function routeEvent(sock, eventName, update) {
  for (const [name, obs] of observers) {
    if (obs.enabled && obs.event === eventName) try { await obs.execute(sock, update, { db, fonts, logger }) } catch (e) {}
  }
}
