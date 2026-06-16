/**
 * @fileOverview AstraX High-Speed Message Router.
 * v1.2.5: Removed all fromMe restrictions. Professional Colored Logs.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
  }

  async handle(msg) {
    // 1. Basic Safety
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    const ctx = new Context(this.bot, msg);
    if (!ctx.sender) return;

    const senderId = ctx.sender.split('@')[0];
    const chatType = ctx.isGroup ? '\x1b[35m[GROUP]\x1b[0m' : '\x1b[34m[PRIVATE]\x1b[0m';
    
    // 2. Command Resolution
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    let isCommand = false;
    let commandName = '';
    let args = [];

    if (ctx.text.startsWith(prefix)) {
      isCommand = true;
      const fullContent = ctx.text.slice(prefix.length).trim();
      args = fullContent.split(/ +/);
      commandName = args.shift().toLowerCase();
    }

    // 3. Colored Expert Logging
    const label = isCommand ? '\x1b[32m[COMMAND]\x1b[0m' : '\x1b[36m[MESSAGE]\x1b[0m';
    const cleanContent = ctx.text ? ctx.text.substring(0, 50).replace(/\n/g, ' ') : '[MEDIA]';
    
    console.log(`${label} ${chatType} @${senderId} | ${cleanContent}${ctx.text?.length > 50 ? '...' : ''}`);

    // 4. Recursive Loop Guard (Ignore bot's own formatted boxed results to prevent loops)
    if (ctx.text.includes('┌──⌈') || ctx.text.includes('└─ 🌌')) return;

    // 5. Execution
    if (isCommand && commandName) {
      const command = this.bot.commands.get(commandName);
      if (command) {
        await this.commandHandler.execute(command, ctx, args);
      }
    }
  }
}

export default MessageHandler;