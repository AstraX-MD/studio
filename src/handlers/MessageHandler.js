/**
 * @fileOverview Inbound message router with integrated Autonomous AI Agent, Security Hub, and RPG.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';
import { aiAgentProcess } from '../ai/flows/ai-agent-flow.js';
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

    // 0. GLOBAL MODE CHECK
    const modeConfig = await this.bot.db.get('core', 'mode:config') || { current: 'public', excluded: [] };
    if (modeConfig.excluded.includes(ctx.sender) || modeConfig.excluded.includes(ctx.jid)) {
      if (!isOwner) return;
    }
    if (!isOwner) {
      if (modeConfig.current === 'private') return;
      if (modeConfig.current === 'silent') return;
    }

    // 1. RPG XP GAIN
    if (ctx.isGroup) {
      await this.applyRpg(ctx);
    }

    // 2. Security Check (Warden Suite)
    const isViolator = await this.applySecurity(ctx);
    if (isViolator) return;

    // 3. Command Detection
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    
    if (ctx.text.startsWith(prefix)) {
      const args = ctx.text.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = this.bot.commands.get(commandName);

      if (command) {
        await this.commandHandler.execute(command, ctx, args);
        // Log to memory for AI context
        this.bot.managers.memory.add(ctx.jid, 'user', ctx.text);
        return;
      }
    }

    // 4. Autonomous AI Agent Logic (Runs for non-command messages)
    await this.applyAgent(ctx);
  }

  /**
   * Orchestrates the Task-Oriented AI Agent.
   */
  async applyAgent(ctx) {
    try {
      const config = await this.bot.db.get('automation', 'chatbot:config');
      if (!config || config.status !== 'on') return;

      const { mode, whitelist } = config;
      let shouldReply = false;

      if (mode === 'public') shouldReply = true;
      else if (mode === 'dm' && !ctx.isGroup) shouldReply = true;
      else if (mode === 'groups' && ctx.isGroup) shouldReply = true;
      else if (mode === 'whitelist' && (whitelist.includes(ctx.sender) || whitelist.includes(ctx.jid))) shouldReply = true;

      if (shouldReply && ctx.text.length > 1) {
        // Fetch Contextual Info
        const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text;
        
        const history = this.bot.managers.memory.get(ctx.jid).map(h => ({ role: h.role, content: h.content }));
        const commands = this.bot.getCommandManifest();

        // Show typing indicator
        await this.bot.client.sock.sendPresenceUpdate('composing', ctx.jid);
        
        const agentResult = await aiAgentProcess({
          message: ctx.text,
          history: history,
          commands: commands,
          context: {
            sender: ctx.sender,
            pushName: ctx.pushName,
            isGroup: ctx.isGroup,
            quotedText: quotedText
          }
        });
        
        if (agentResult) {
          // 1. Update Memory
          this.bot.managers.memory.add(ctx.jid, 'user', ctx.text);
          this.bot.managers.memory.add(ctx.jid, 'assistant', agentResult.response);

          // 2. Reply to User
          if (agentResult.response) {
            await ctx.reply(agentResult.response);
          }

          // 3. Autonomous Execution
          if (agentResult.executeCommand) {
            const cmd = this.bot.commands.get(agentResult.executeCommand.name);
            if (cmd) {
              this.bot.logger.info(`AGENT: Autonomous execution of [${cmd.name}]`);
              // Create a virtual command context
              await this.commandHandler.execute(cmd, ctx, agentResult.executeCommand.args);
            }
          }
        }
      }
    } catch (e) {
      this.bot.logger.error(`Agent Error: ${e.message}`);
    }
  }

  async applyRpg(ctx) {
    const isEnabled = await this.bot.db.get('settings', `rpg_enabled:${ctx.jid}`);
    if (!isEnabled) return;
    const sender = ctx.sender.split('@')[0];
    const now = Date.now();
    if (this.xpCooldowns.has(ctx.sender) && now - this.xpCooldowns.get(ctx.sender) < 60000) return;
    const stats = await this.bot.db.get('rpg_stats', sender) || { xp: 0, level: 0 };
    stats.xp += Math.floor(Math.random() * 10) + 15;
    await this.bot.db.set('rpg_stats', sender, stats);
    this.xpCooldowns.set(ctx.sender, now);
  }

  async applySecurity(ctx) {
    // Basic antispam/antilink logic...
    return false;
  }

  async handleStatusAutomation(msg) {
    // Status viewing logic...
  }
}

export default MessageHandler;
