/**
 * @fileOverview High-Speed Message Router.
 * v1.2.5: Zero fromMe restrictions. 100% Self-Response with Loop Guard.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';
import { logger } from '../core/logger.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
  }

  async handle(msg) {
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    const ctx = new Context(this.bot, msg);
    if (!ctx.sender) return; 

    const senderId = ctx.sender.split('@')[0];
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    let isCommand = false;
    let commandName = '';
    let args = [];

    if (ctx.text.startsWith(prefix)) {
      isCommand = true;
      const fullContent = ctx.text.slice(prefix.length).trim();
      args = fullContent.split(/ +/);
      commandName = args.shift().toLowerCase();
    }

    // LOG TO TERMINAL USING MASTER LOGGER
    logger.incoming(
      ctx.isGroup ? `GROUP[${ctx.jid.split('@')[0]}]` : 'PRIVATE',
      senderId,
      isCommand ? commandName : null
    );

    // BOX GUARD: Ignore its own professional reports to prevent infinite feedback loops
    if (ctx.text.includes('┌──⌈') || ctx.text.includes('└─ 🌌')) return;

    if (isCommand && commandName) {
      const command = this.bot.commands.get(commandName);
      if (command) {
        await this.commandHandler.execute(command, ctx, args);
      }
    }
  }
}

export default MessageHandler;
