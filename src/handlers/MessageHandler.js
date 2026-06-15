/**
 * @fileOverview Inbound message router with integrated Automation Hub.
 */
import Context from '../core/Context.js';
import CommandHandler from './CommandHandler.js';

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
  }

  async handle(msg) {
    // 1. Basic sanity checks
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') {
      if (msg.key.remoteJid === 'status@broadcast') {
        const viewConfig = await this.bot.db.get('automation', 'viewstatus');
        if (viewConfig?.enabled) {
          await this.bot.client.sock.readMessages([msg.key]);
          this.bot.logger.info(`Status viewed: ${msg.pushName || msg.key.participant}`);
        }
      }
      return;
    }

    const ctx = new Context(this.bot, msg);
    
    // 2. Resolve Automation (Typing/Recording/Read/React)
    await this.applyAutomation(ctx);

    // 3. Resolve Dynamic Prefix
    const prefix = await this.bot.managers.settings.get('core', 'prefix', ctx.isGroup ? ctx.jid : null) || '!';
    
    // 4. Maintenance Mode Check
    const isMaintenance = await this.bot.managers.settings.isMaintenance();
    if (isMaintenance) {
      const userRole = await this.bot.managers.roles.getRole(ctx.sender);
      if (userRole < 9) return; 
    }

    // 5. Command Detection
    if (!ctx.text.startsWith(prefix)) return;

    const args = ctx.text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // 6. Lookup Command or Alias
    const command = this.bot.commands.get(commandName);
    if (!command) return;

    // 7. Execute via CommandHandler
    await this.commandHandler.execute(command, ctx, args);
  }

  /**
   * Applies automation settings for the current context.
   */
  async applyAutomation(ctx) {
    try {
      const senderId = ctx.sender.split('@')[0];
      const jid = ctx.jid;
      const isGroup = ctx.isGroup;

      // 1. Auto Read (Blue Tick)
      const readAll = await this.bot.db.get('automation', 'read:all');
      const readType = await this.bot.db.get('automation', isGroup ? 'read:groups' : 'read:dm');
      if (readAll?.enabled || readType?.enabled) {
        await this.bot.client.sock.readMessages([ctx.msg.key]);
      }

      // 2. Auto React
      const reactConfig = await this.bot.db.get('automation', `react:all`) || 
                          await this.bot.db.get('automation', `react:${senderId}`);
      if (reactConfig?.enabled && reactConfig.emojis?.length > 0) {
        const emoji = reactConfig.emojis[Math.floor(Math.random() * reactConfig.emojis.length)];
        await ctx.react(emoji).catch(() => {});
      }

      // 3. Presence Automation (Typing/Recording)
      const typeConfig = await this.bot.db.get('automation', `typing:all`) || 
                         await this.bot.db.get('automation', `typing:${senderId}`);
      const recConfig = await this.bot.db.get('automation', `record:all`) || 
                        await this.bot.db.get('automation', `record:${senderId}`);

      if (typeConfig?.enabled) {
        await this.bot.client.sock.sendPresenceUpdate('composing', jid);
        await new Promise(r => setTimeout(r, (typeConfig.duration || 5) * 1000));
        await this.bot.client.sock.sendPresenceUpdate('paused', jid);
      }

      if (recConfig?.enabled) {
        await this.bot.client.sock.sendPresenceUpdate('recording', jid);
        await new Promise(r => setTimeout(r, (recConfig.duration || 5) * 1000));
        await this.bot.client.sock.sendPresenceUpdate('paused', jid);
      }
    } catch (e) {
      this.bot.logger.error(`Automation error: ${e.message}`);
    }
  }
}

export default MessageHandler;
