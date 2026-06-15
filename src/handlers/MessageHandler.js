/**
 * @fileOverview Inbound message router with Expert Level Logging.
 * v1.2.5-EXPERT: Zero fromMe restrictions. 100% Self-Response.
 * Version: Standardized Stability Core.
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
    
    // 1. High-Visibility Terminal Logger (Null-Safe Expert Style)
    const senderId = ctx.sender ? ctx.sender.split('@')[0] : 'SYSTEM_NODE';
    const logHeader = `[INBOUND] @${senderId}`;
    const logContent = ctx.text ? ctx.text.substring(0, 50) : '[MEDIA_PAYLOAD]';
    console.log(`┃ ${logHeader.padEnd(20)} | Content: ${logContent}${logContent.length > 50 ? '...' : ''}`);

    // 2. RECURSIVE LOOP GUARD
    // Prevent the bot from answering its own "Boxed Frames" to avoid feedback loops.
    if (ctx.fromMe && (ctx.text.includes('┌──⌈') || ctx.text.includes('└─ 🌌') || ctx.text.includes('├─⊷'))) {
       return; 
    }

    // 3. Prefix & Command Resolution
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    let isCommand = false;
    let commandName = '';
    let args = [];

    if (ctx.text.startsWith(prefix)) {
      isCommand = true;
      const fullContent = ctx.text.slice(prefix.length).trim();
      args = fullContent.split(/ +/);
      commandName = args.shift().toLowerCase();
    } else {
      // Hybrid detection: check if first word is a registered command (Expert convenience)
      const parts = ctx.text.trim().split(/ +/);
      if (parts.length > 0) {
        const possibleCmd = parts.shift().toLowerCase();
        if (this.bot.commands.has(possibleCmd)) {
          isCommand = true;
          commandName = possibleCmd;
          args = parts;
        }
      }
    }

    // 4. Execution
    if (isCommand && commandName) {
      const command = this.bot.commands.get(commandName);
      if (command) {
        console.log(`┃ [COMMAND] EXECUTING: ${commandName.toUpperCase()} for @${senderId}`);
        await this.commandHandler.execute(command, ctx, args);
        return;
      }
    }

    // 5. AI Agent Fallback (Optional / Contextual)
    if (this.agent && ctx.text.length > 1) {
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