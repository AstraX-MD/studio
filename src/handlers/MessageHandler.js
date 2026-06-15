/**
 * @fileOverview Inbound message router with integrated Granular Automation, Security Hub & RPG System.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';
import { aiContentModeration } from '../ai/flows/ai-content-moderation-flow.js';
import channelConfig from '../configs/channels.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
    this.spamTracker = new Map();
    this.xpCooldowns = new Map();
  }

  async handle(msg) {
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') {
      if (msg.key.remoteJid === 'status@broadcast') {
        await this.handleStatusAutomation(msg);
      }
      return;
    }

    const ctx = new Context(this.bot, msg);
    const userRole = await this.bot.managers.roles.getRole(ctx.sender, ctx.isGroup ? ctx.jid : null);
    const isOwner = userRole >= 9;
    const isSudo = userRole >= 8;

    // 0. GLOBAL MODE CHECK
    const modeConfig = await this.bot.db.get('core', 'mode:config') || { current: 'public', excluded: [] };
    if (modeConfig.excluded.includes(ctx.sender) || modeConfig.excluded.includes(ctx.jid)) {
      if (!isOwner) return;
    }
    if (!isOwner) {
      if (modeConfig.current === 'private') return;
      if (modeConfig.current === 'silent') return;
      if (modeConfig.current === 'dm' && ctx.isGroup) return;
      if (modeConfig.current === 'groups' && !ctx.isGroup) return;
    }

    // 1. RPG XP GAIN (Only in Groups if enabled)
    if (ctx.isGroup) {
      await this.applyRpg(ctx);
    }

    // 2. SNITCH LOGIC (Sticker reply to ViewOnce)
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (ctx.msg.message?.stickerMessage && (quoted?.imageMessage?.viewOnce || quoted?.videoMessage?.viewOnce)) {
      await this.handleSnitch(ctx, isSudo ? ctx.sender : this.bot.config.owners[0] + '@s.whatsapp.net');
    }

    // 3. Security Check (Warden Suite)
    const isViolator = await this.applySecurity(ctx);
    if (isViolator) return;

    // 4. Automation Check
    const shouldStop = await this.applyAutomation(ctx);
    if (shouldStop) return;

    // 5. Command Detection
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    if (!ctx.text.startsWith(prefix)) return;

    const args = ctx.text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.bot.commands.get(commandName);

    if (command) {
      // Apply Channel Forwarding context if enabled
      const forwardEnabled = await this.bot.db.get('core', 'forward_channel') || false;
      if (forwardEnabled) {
        ctx.forwardContext = {
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelConfig.updates.jid,
            serverMessageId: 100,
            newsletterName: channelConfig.updates.name
          }
        };
      }
      await this.commandHandler.execute(command, ctx, args);
    }
  }

  /**
   * Grant XP to users for group engagement.
   */
  async applyRpg(ctx) {
    const isEnabled = await this.bot.db.get('settings', `rpg_enabled:${ctx.jid}`);
    if (!isEnabled) return;

    const sender = ctx.sender.split('@')[0];
    const now = Date.now();
    const cooldown = 60000; // 1 minute XP cooldown

    if (this.xpCooldowns.has(ctx.sender)) {
      if (now - this.xpCooldowns.get(ctx.sender) < cooldown) return;
    }

    const stats = await this.bot.db.get('rpg_stats', sender) || { xp: 0, level: 0 };
    const xpGain = Math.floor(Math.random() * 10) + 15; // 15-25 XP per msg
    
    const oldLevel = Math.floor(Math.sqrt(stats.xp / 100));
    stats.xp += xpGain;
    const newLevel = Math.floor(Math.sqrt(stats.xp / 100));
    
    await this.bot.db.set('rpg_stats', sender, stats);
    this.xpCooldowns.set(ctx.sender, now);

    if (newLevel > oldLevel) {
      const botName = await this.bot.managers.settings.get('core', 'name') || this.bot.config.name;
      const congrats = `┌──⌈ 🎊 LEVEL UP! ⌋
┃
┃ User: @${sender}
┃ Level: ${oldLevel} ➔ ${newLevel}
┃ Reward: +$1,000 Credits
┃
├─⊷ Status: PROMOTED
└────────────────
  © ${botName.toUpperCase()}`;
      
      await ctx.reply(congrats, { mentions: [ctx.sender] });
      
      // Auto-reward economy
      const eco = await this.bot.db.get('economy', sender) || { wallet: 0, bank: 0 };
      eco.wallet += 1000;
      await this.bot.db.set('economy', sender, eco);
    }
  }

  async handleSnitch(ctx, recipient) {
    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      const quoted = ctx.msg.message.extendedTextMessage.contextInfo.quotedMessage;
      const type = quoted.imageMessage ? 'image' : 'video';
      
      const botName = await this.bot.managers.settings.get('core', 'name') || this.bot.config.name;
      const caption = `┌──⌈ 👁️ SNITCH ⌋\n┃ User: @${ctx.sender.split('@')[0]}\n┃ Source: View-Once Reply\n┃ Status: Intercepted\n└─ 🌌 ${botName.toUpperCase()}`;

      await this.bot.client.sock.sendMessage(recipient, { 
        [type]: buffer, 
        caption, 
        mentions: [ctx.sender] 
      });
    } catch (e) {
      this.bot.logger.error(`Snitch Error: ${e.message}`);
    }
  }

  async applySecurity(ctx) {
    const sender = ctx.sender;
    const jid = ctx.jid;
    const userRole = await this.bot.managers.roles.getRole(sender, jid);
    if (userRole >= 5) return false;

    const spamConfig = await this.bot.db.get('security', 'antispam:config');
    if (spamConfig?.mode === 'on' || (spamConfig?.mode === 'groups' && ctx.isGroup) || (spamConfig?.mode === 'dm' && !ctx.isGroup)) {
      const now = Date.now();
      const track = this.spamTracker.get(sender) || { count: 0, last: 0 };
      if (now - track.last < 10000) {
        track.count++;
        if (track.count >= (spamConfig.threshold || 5)) {
          await this.executePunishment(ctx, spamConfig.action || 'mute', 'SPAM-FLOOD');
          this.spamTracker.set(sender, { count: 0, last: now });
          return true;
        }
      } else { track.count = 1; track.last = now; }
      this.spamTracker.set(sender, track);
    }

    if (!ctx.isGroup) return false;

    const checkMedia = async (type, condition, reason) => {
      const config = await this.bot.db.get('security', `anti${type}:${jid}`);
      if (config?.mode === 'on' && condition) {
        await this.executePunishment(ctx, config.action || 'delete', reason);
        return true;
      }
      return false;
    };

    if (await checkMedia('link', /(chat.whatsapp.com\/)([0-9A-Za-z]{20,24})/i.test(ctx.text), 'LINK-VIOLATION')) return true;
    if (await checkMedia('sticker', ctx.msg.message?.stickerMessage, 'STICKER-VIOLATION')) return true;
    if (await checkMedia('audio', ctx.msg.message?.audioMessage && !ctx.msg.message?.audioMessage?.ptt, 'AUDIO-FILE')) return true;
    if (await checkMedia('voicemail', ctx.msg.message?.audioMessage?.ptt, 'VOICE-NOTE')) return true;
    if (await checkMedia('video', ctx.msg.message?.videoMessage, 'VIDEO-FILE')) return true;
    if (await checkMedia('poll', ctx.msg.message?.pollCreationMessage, 'POLL-DETECTION')) return true;
    if (await checkMedia('document', ctx.msg.message?.documentMessage, 'DOCUMENT-FILE')) return true;
    if (await checkMedia('forward', ctx.msg.message?.contextInfo?.isForwarded, 'FORWARDED-MSG')) return true;

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
        await ctx.reply(`┌──⌈ ☢️ AUTO-BAN ⌋\n┃ Threshold exceeded.\n┃ Action: Removal\n└────────────────`);
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

      const readConfig = await this.bot.db.get('automation', 'read:config');
      if (checkActive(readConfig)) await this.bot.client.sock.readMessages([ctx.msg.key]);

      const reactConfig = await this.bot.db.get('automation', 'react:config');
      if (checkActive(reactConfig)) {
        const emojis = reactConfig.emojis || ['🔥'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        await ctx.react(emoji).catch(() => {});
      }
    } catch (e) {
      this.bot.logger.error(`Automation Error: ${e.message}`);
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
