/**
 * @fileOverview Inbound message router with integrated Granular Automation & Security Hub.
 * Updated to support Anti-Spam, Anti-Toxic, Anti-Word, and Anti-TagAll logic.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';
import { aiContentModeration } from '../ai/flows/ai-content-moderation-flow.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
    this.spamTracker = new Map(); // { sender: { count: 0, last: timestamp } }
  }

  async handle(msg) {
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') {
      if (msg.key.remoteJid === 'status@broadcast') {
        await this.handleStatusAutomation(msg);
      }
      return;
    }

    const ctx = new Context(this.bot, msg);
    
    // 1. Security Check (Anti-Link, Anti-Bot, Anti-Sticker, Anti-Emoji, Anti-Spam, etc.)
    const isViolator = await this.applySecurity(ctx);
    if (isViolator) return;

    // 2. Automation Check (Typing/Recording/Read/React)
    const shouldStop = await this.applyAutomation(ctx);
    if (shouldStop) return;

    // 3. Command Detection
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    if (!ctx.text.startsWith(prefix)) return;

    const args = ctx.text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = this.bot.commands.get(commandName);
    if (!command) return;

    await this.commandHandler.execute(command, ctx, args);
  }

  /**
   * Specifically handles group security violations.
   */
  async applySecurity(ctx) {
    const sender = ctx.sender;
    const jid = ctx.jid;
    const userRole = await this.bot.managers.roles.getRole(sender, jid);

    // Skip checks for Admins/Owners
    if (userRole >= 5) return false;

    // 1. Anti-Spam (Flood Protection)
    const spamConfig = await this.bot.db.get('security', 'antispam:config');
    if (spamConfig?.mode === 'on' || (spamConfig?.mode === 'groups' && ctx.isGroup) || (spamConfig?.mode === 'dm' && !ctx.isGroup)) {
      const now = Date.now();
      const track = this.spamTracker.get(sender) || { count: 0, last: 0 };
      
      if (now - track.last < 10000) { // 10s interval
        track.count++;
        if (track.count >= (spamConfig.threshold || 5)) {
          await this.executePunishment(ctx, spamConfig.action || 'mute', 'SPAM-FLOOD');
          this.spamTracker.set(sender, { count: 0, last: now });
          return true;
        }
      } else {
        track.count = 1;
        track.last = now;
      }
      this.spamTracker.set(sender, track);
    }

    if (!ctx.isGroup) return false;

    // 2. Anti-Link
    const linkConfig = await this.bot.db.get('security', `antilink:${jid}`);
    if (linkConfig?.mode === 'on') {
      const groupLinkRegex = /(chat.whatsapp.com\/)([0-9A-Za-z]{20,24})/i;
      if (groupLinkRegex.test(ctx.text)) {
        await this.executePunishment(ctx, linkConfig.action, 'LINK-VIOLATION');
        return true;
      }
    }

    // 3. Anti-Sticker
    const stickerConfig = await this.bot.db.get('security', `antisticker:${jid}`);
    if (stickerConfig?.mode === 'on' && ctx.msg.message?.stickerMessage) {
      await this.executePunishment(ctx, stickerConfig.action, 'STICKER-VIOLATION');
      return true;
    }

    // 4. Anti-Emoji
    const emojiConfig = await this.bot.db.get('security', `antiemoji:${jid}`);
    if (emojiConfig?.mode === 'on') {
      const emojis = ctx.text.match(/[\p{Emoji}]/gu) || [];
      if (emojis.length > 5) {
        await this.executePunishment(ctx, emojiConfig.action, 'EMOJI-FLOOD');
        return true;
      }
    }

    // 5. Anti-TagAll
    const tagAllConfig = await this.bot.db.get('security', `antitagall:${jid}`);
    if (tagAllConfig?.mode === 'on') {
      const mentions = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentions.length > 10 || ctx.text.includes('@everyone') || ctx.text.includes('@here')) {
        await this.executePunishment(ctx, tagAllConfig.action || 'delete', 'MASS-MENTION');
        return true;
      }
    }

    // 6. Anti-Toxic (AI Powered)
    const toxicConfig = await this.bot.db.get('security', `antitoxic:${jid}`);
    if (toxicConfig?.mode === 'on' && ctx.text.length > 5) {
      try {
        const result = await aiContentModeration({ message: ctx.text });
        if (!result.isAppropriate) {
          await this.executePunishment(ctx, toxicConfig.action || 'warn', 'TOXIC-CONTENT');
          return true;
        }
      } catch (e) {}
    }

    // 7. Anti-Word
    const wordConfig = await this.bot.db.get('security', `antiword:${jid}`);
    if (wordConfig?.mode === 'on' && wordConfig.words?.length > 0) {
      const hasBanned = wordConfig.words.some(w => ctx.text.toLowerCase().includes(w.toLowerCase()));
      if (hasBanned) {
        await this.executePunishment(ctx, wordConfig.action || 'delete', 'BANNED-WORD');
        return true;
      }
    }

    return false;
  }

  async executePunishment(ctx, action, reason) {
    const target = ctx.sender;
    const jid = ctx.jid;

    if (action === 'delete' || action === 'kick' || action === 'warn') {
      await this.bot.client.sock.sendMessage(jid, { delete: ctx.msg.key }).catch(() => {});
    }

    if (action === 'warn') {
      const key = `warns:${jid}:${target.split('@')[0]}`;
      const count = ((await this.bot.db.get('group_warns', key)) || 0) + 1;
      await this.bot.db.set('group_warns', key, count);
      
      await ctx.reply(`┌──⌈ ⚠️ WARDEN ⌋\n┃ User: @${target.split('@')[0]}\n┃ Violation: ${reason}\n┃ Strike: ${count}/3\n└────────────────`, { mentions: [target] });
      
      if (count >= 3) {
        await ctx.reply(`┌──⌈ ☢️ AUTO-BAN ⌋\n┃ Threshold exceeded.\n┃ Action: Permanent Removal\n└────────────────`);
        await this.bot.client.sock.groupParticipantsUpdate(jid, [target], "remove");
        await this.bot.db.delete('group_warns', key);
      }
    }

    if (action === 'kick') {
      await ctx.reply(`┌──⌈ 🚫 WARDEN ⌋\n┃ Target: @${target.split('@')[0]}\n┃ Action: Instant Kick\n┃ Reason: ${reason}\n└────────────────`, { mentions: [target] });
      await this.bot.client.sock.groupParticipantsUpdate(jid, [target], "remove");
    }
  }

  async applyAutomation(ctx) {
    try {
      const jid = ctx.jid;
      const sender = ctx.sender;
      const isGroup = ctx.isGroup;

      const checkActive = (config) => {
        if (!config || config.mode === 'off') return false;
        if (config.targets?.includes(sender)) return true;
        if (config.mode === 'both') return true;
        if (config.mode === 'dm' && !isGroup) return true;
        if (config.mode === 'groups' && isGroup) return true;
        return false;
      };

      // Auto Read
      const readConfig = await this.bot.db.get('automation', 'read:config');
      if (checkActive(readConfig)) {
        await this.bot.client.sock.readMessages([ctx.msg.key]);
      }

      // Auto React
      const reactConfig = await this.bot.db.get('automation', 'react:config');
      if (checkActive(reactConfig)) {
        const emojis = reactConfig.emojis || ['🔥'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        await ctx.react(emoji).catch(() => {});
      }

      // Presence Automation (Typing)
      const typeConfig = await this.bot.db.get('automation', 'typing:config');
      if (checkActive(typeConfig)) {
        await this.bot.client.sock.sendPresenceUpdate('composing', jid);
        await new Promise(r => setTimeout(r, (typeConfig.duration || 5) * 1000));
        await this.bot.client.sock.sendPresenceUpdate('paused', jid);
      }

      // Presence Automation (Recording)
      const recConfig = await this.bot.db.get('automation', 'record:config');
      if (checkActive(recConfig)) {
        await this.bot.client.sock.sendPresenceUpdate('recording', jid);
        await new Promise(r => setTimeout(r, (recConfig.duration || 10) * 1000));
        await this.bot.client.sock.sendPresenceUpdate('paused', jid);
      }

      // Anti-ViewOnce Recovery
      const viewOnceConfig = await this.bot.db.get('security', 'antiviewonce:config');
      if (checkActive(viewOnceConfig) && (ctx.msg.message?.imageMessage?.viewOnce || ctx.msg.message?.videoMessage?.viewOnce)) {
          // Log or resend message without viewOnce flag
          const cloned = JSON.parse(JSON.stringify(ctx.msg.message));
          if (cloned.imageMessage) cloned.imageMessage.viewOnce = false;
          if (cloned.videoMessage) cloned.videoMessage.viewOnce = false;
          
          await ctx.reply(`┌──⌈ 👁️ WARDEN ⌋\n┃ Task: View-Once Recover\n┃ User: @${sender.split('@')[0]}\n└────────────────`, { mentions: [sender] });
          await ctx.sock.sendMessage(jid, cloned, { quoted: ctx.msg });
      }
    } catch (e) {
      this.bot.logger.error(`Automation Hub Error: ${e.message}`);
    }
    return false;
  }

  async handleStatusAutomation(msg) {
    try {
      const viewConfig = await this.bot.db.get('automation', 'status:config');
      if (viewConfig?.mode === 'on') {
        await this.bot.client.sock.readMessages([msg.key]);
        const likeConfig = await this.bot.db.get('automation', 'status:like:config');
        if (likeConfig?.mode === 'on') {
          const emojis = likeConfig.emojis || ['❤️'];
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          await this.bot.client.sock.sendMessage('status@broadcast', {
            react: { text: emoji, key: msg.key }
          }, { statusJidList: [msg.key.participant] });
        }
      }
    } catch (e) {}
  }
}

export default MessageHandler;
