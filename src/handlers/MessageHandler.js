
/**
 * @fileOverview Inbound message router.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
  }

  async handle(msg) {
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    const ctx = new Context(this.bot, msg);
    
    // Check for prefix (defaulting to ! for now)
    const prefix = '!'; 
    if (!ctx.text.startsWith(prefix)) return;

    const args = ctx.text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = this.bot.commands.get(commandName);
    if (!command) return;

    await this.commandHandler.execute(command, ctx, args);
  }
}

export default MessageHandler;
