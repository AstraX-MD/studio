/**
 * @fileOverview Inbound message router with Dynamic Prefix Modes, Autonomous AI Agent, and RPG.
 * Updated with safe dynamic imports to prevent deployment crashes.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
    this.xpCooldowns = new Map();
    this.agent = null;
    this._initAgent();
  }

  /**
   * Safely initialize the AI Agent subsystem.
   * Skips if the module is missing or uncompiled.
   */
  async _initAgent() {
    try {
      const { aiAgentProcess } = await import('../ai/flows/ai-agent-flow.js');
      this.agent = aiAgentProcess;
      this.bot.logger.info('AI Agent Subsystem: CONNECTED');
    } catch (e) {
      this.bot.logger.warn('AI Agent Subsystem: SKIPPED (Module not found or uncompiled)');
    }
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

    // 2. Command Detection with Dynamic Prefix Modes
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    const prefixMode = await this.bot.managers.settings.get('core', 'prefixMode', 'global') || 'hybrid'; // prefix, noprefix, hybrid
    
    let isCommand = false;
    let commandName = '';
    let args = [];

    // Mode: Standard Prefix
    if (ctx.text.startsWith(prefix)) {
      isCommand = true;
      args = ctx.text.slice(prefix.length).trim().split(/ +/);
      commandName = args.shift().toLowerCase();
    } 
    // Mode: No-Prefix or Hybrid
    else if (prefixMode === 'noprefix' || prefixMode === 'hybrid') {
      const parts = ctx.text.trim().split(/ +/);
      const possibleCmd = parts.shift().toLowerCase();
      if (this.bot.commands.has(possibleCmd)) {
        isCommand = true;
        commandName = possibleCmd;
        args = parts;
      }
    }

    if (isCommand) {
      const command = this.bot.commands.get(commandName);
      if (command) {
        await this.commandHandler.execute(command, ctx, args);
        this.bot.managers.memory.add(ctx.jid, 'user', ctx.text);
        return;
      }
    }

    // 3. Autonomous AI Agent Logic (Runs for non-command messages if enabled)
    if (this.agent) {
      await this.applyAgent(ctx);
    }
  }

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
        const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text;
        const history = this.bot.managers.memory.get(ctx.jid).map(h => ({ role: h.role, content: h.content }));
        const commands = this.bot.getCommandManifest();

        await this.bot.client.sock.sendPresenceUpdate('composing', ctx.jid);
        
        const agentResult = await this.agent({
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
          this.bot.managers.memory.add(ctx.jid, 'user', ctx.text);
          this.bot.managers.memory.add(ctx.jid, 'assistant', agentResult.response);

          if (agentResult.response) await ctx.reply(agentResult.response);

          if (agentResult.executeCommand) {
            const cmd = this.bot.commands.get(agentResult.executeCommand.name);
            if (cmd) {
              await this.commandHandler.execute(cmd, ctx, agentResult.executeCommand.args);
            }
          }
        }
      }
    } catch (e) {
      this.bot.logger.error(`Agent Interaction Error: ${e.message}`);
    }
  }

  async applyRpg(ctx) {
    const isEnabled = await this.bot.db.get('settings', `rpg_enabled:${ctx.jid}`);
    if (!isEnabled) return;
    const sender = ctx.sender.split('@')[0];
    const now = Date.now();
    if (this.xpCooldowns.has(ctx.sender) && now - this.xpCooldowns.get(ctx.sender) < 60000) return;
    
    const stats = await this.bot.db.get('rpg_stats', sender) || { xp: 0, level: 0 };
    const xpGain = Math.floor(Math.random() * 10) + 15;
    stats.xp += xpGain;

    // Check Level Up: Lvl = floor(sqrt(xp/100))
    const newLevel = Math.floor(Math.sqrt(stats.xp / 100));
    if (newLevel > (stats.level || 0)) {
      stats.level = newLevel;
      const botName = await this.bot.managers.settings.get('core', 'name') || this.bot.config.name;
      
      // Reward Level Up (Economy Integration)
      const eco = await this.bot.db.get('economy', sender) || { wallet: 0, bank: 0 };
      eco.wallet += 1000;
      await this.bot.db.set('economy', sender, eco);

      ctx.reply(`┌──⌈ 🆙 LEVEL UP ⌋\n┃ \n┃ User: @${sender}\n┃ New Level: ${newLevel}\n┃ Reward: $1,000 Credits\n┃ \n└─ 🌌 ${botName.toUpperCase()}`, { mentions: [ctx.sender] });
    }

    await this.bot.db.set('rpg_stats', sender, stats);
    this.xpCooldowns.set(ctx.sender, now);
  }

  async handleStatusAutomation(msg) { 
    const config = await this.bot.db.get('automation', 'status:config');
    if (config?.mode === 'on') {
      this.bot.logger.info(`Auto-Viewed status from ${msg.key.participant}`);
      await this.bot.client.sock.readMessages([msg.key]);
      
      const likeConfig = await this.bot.db.get('automation', 'status:like:config');
      if (likeConfig?.mode === 'on') {
        const emoji = likeConfig.emojis[Math.floor(Math.random() * likeConfig.emojis.length)];
        await this.bot.client.sock.sendMessage(msg.key.remoteJid, {
          react: { text: emoji, key: msg.key }
        }, { statusJidList: [msg.key.participant] });
      }
    }
  }
}

export default MessageHandler;
