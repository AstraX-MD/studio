/**
 * @fileOverview Inbound message router with High-Visibility Logging.
 * v1.2.5: Optimized for instant command detection and self-reply support.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
    this.agent = null;
    this._initAgent();
  }

  async _initAgent() {
    try {
      const { aiAgentProcess } = await import('../ai/flows/ai-agent-flow.js');
      this.agent = aiAgentProcess;
    } catch (e) {}
  }

  async handle(msg) {
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    const ctx = new Context(this.bot, msg);
    
    // 1. High-Visibility Terminal Logger
    const senderId = ctx.sender.split('@')[0];
    const logHeader = `[INBOUND] @${senderId}`;
    console.log(`┃ ${logHeader.padEnd(20)} | Content: ${ctx.text.substring(0, 50)}${ctx.text.length > 50 ? '...' : ''}`);

    // 2. SELF-REPLY PROTECTION
    // Skip if the message is a "Boxed Report" from the bot itself to prevent loops
    if (ctx.fromMe && (ctx.text.includes('┌──⌈') || ctx.text.includes('└─ 🌌'))) {
       return; 
    }

    // 3. Prefix & Command Resolution
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    let isCommand = false;
    let commandName = '';
    let args = [];

    if (ctx.text.startsWith(prefix)) {
      isCommand = true;
      args = ctx.text.slice(prefix.length).trim().split(/ +/);
      commandName = args.shift().toLowerCase();
    } else {
      // Hybrid detection: check if the first word is a registered command
      const parts = ctx.text.trim().split(/ +/);
      const possibleCmd = parts.shift().toLowerCase();
      if (this.bot.commands.has(possibleCmd)) {
        isCommand = true;
        commandName = possibleCmd;
        args = parts;
      }
    }

    // 4. Execution
    if (isCommand) {
      const command = this.bot.commands.get(commandName);
      if (command) {
        console.log(`┃ [COMMAND] EXECUTING: ${commandName.toUpperCase()} for @${senderId}`);
        await this.commandHandler.execute(command, ctx, args);
        return;
      }
    }

    // 5. AI Agent Fallback (Only for others, to save tokens)
    if (this.agent && !ctx.fromMe && ctx.text.length > 1) {
      await this.applyAgent(ctx);
    }
  }

  async applyAgent(ctx) {
    try {
      const config = await this.bot.db.get('automation', 'chatbot:config');
      if (!config || config.status !== 'on') return;

      const history = this.bot.managers.memory.get(ctx.jid).map(h => ({ role: h.role, content: h.content }));
      const commands = this.bot.getCommandManifest();

      const agentResult = await this.agent({
        message: ctx.text,
        history: history,
        commands: commands,
        context: {
          sender: ctx.sender,
          pushName: ctx.pushName,
          isGroup: ctx.isGroup
        }
      });
      
      if (agentResult?.response) {
        await ctx.reply(agentResult.response);
        if (agentResult.executeCommand) {
          const cmd = this.bot.commands.get(agentResult.executeCommand.name);
          if (cmd) await this.commandHandler.execute(cmd, ctx, agentResult.executeCommand.args);
        }
      }
    } catch (e) {}
  }
}

export default MessageHandler;
