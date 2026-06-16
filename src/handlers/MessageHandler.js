/**
 * @fileOverview Simple, Clean Message Router with Colors.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
  }

  async handle(msg) {
    // 1. Safety Filter
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    const ctx = new Context(this.bot, msg);
    
    // 2. Identify Sender & Location
    const sender = ctx.sender ? ctx.sender.split('@')[0] : 'SYSTEM';
    const chatType = ctx.isGroup ? '\x1b[35m[GROUP]\x1b[0m' : '\x1b[34m[PRIVATE]\x1b[0m';
    
    // 3. Command Resolution
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

    // 4. Clean Logging
    const label = isCommand ? '\x1b[32m[COMMAND]\x1b[0m' : '\x1b[36m[MESSAGE]\x1b[0m';
    const content = ctx.text ? ctx.text.substring(0, 40) : '[MEDIA]';
    console.log(`${label} ${chatType} @${sender} | ${content}${content.length > 39 ? '...' : ''}`);

    // 5. Recursive Loop Guard
    if (ctx.fromMe && (ctx.text.includes('┌──⌈') || ctx.text.includes('└─ 🌌'))) return;

    // 6. Execution
    if (isCommand && commandName) {
      const command = this.bot.commands.get(commandName);
      if (command) {
        await this.commandHandler.execute(command, ctx, args);
      }
    }
  }
}

export default MessageHandler;