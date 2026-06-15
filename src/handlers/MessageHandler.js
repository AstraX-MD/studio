/**
 * @fileOverview Inbound message router. Updated to support Self-Mode (responding to own messages).
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
  }

  async handle(msg) {
    // 1. Basic sanity checks (Keep broadcast and empty messages filtered)
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    const ctx = new Context(this.bot, msg);
    
    // 2. Resolve Dynamic Prefix (Global or Group-specific)
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    
    // 3. Maintenance Mode Check (Only Owners/Root bypass)
    const isMaintenance = await this.bot.managers.settings.isMaintenance();
    if (isMaintenance) {
      const userRole = await this.bot.managers.roles.getRole(ctx.sender);
      if (userRole < 9) return; 
    }

    // 4. Command Detection
    if (!ctx.text.startsWith(prefix)) return;

    const args = ctx.text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // 5. Lookup Command or Alias
    const command = this.bot.commands.get(commandName);
    if (!command) return;

    // 6. Execute via CommandHandler
    await this.commandHandler.execute(command, ctx, args);
  }
}

export default MessageHandler;