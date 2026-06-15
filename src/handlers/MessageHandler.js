/**
 * @fileOverview Inbound message router with integrated Granular Automation Hub.
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
        const config = await this.bot.db.get('automation', 'status:config');
        if (config?.mode === 'on') {
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
   * Applies automation settings based on mode, type, and target lists.
   */
  async applyAutomation(ctx) {
    try {
      const jid = ctx.jid;
      const sender = ctx.sender;
      const isGroup = ctx.isGroup;

      const checkActive = (config) => {
        if (!config || config.mode === 'off') return false;
        if (config.targets?.includes(sender)) return true;
        if (config.mode === 'both') return true;
        if (config.mode === 'dm' && !isGroup) return true;
        if (config.mode === 'groups' && isGroup) return true;
        return false;
      };

      // 1. Auto Read
      const readConfig = await this.bot.db.get('automation', 'read:config');
      if (checkActive(readConfig)) {
        await this.bot.client.sock.readMessages([ctx.msg.key]);
      }

      // 2. Auto React
      const reactConfig = await this.bot.db.get('automation', 'react:config');
      if (checkActive(reactConfig)) {
        const emojis = reactConfig.emojis || ['🔥'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        await ctx.react(emoji).catch(() => {});
      }

      // 3. Presence Automation (Typing)
      const typeConfig = await this.bot.db.get('automation', 'typing:config');
      if (checkActive(typeConfig)) {
        await this.bot.client.sock.sendPresenceUpdate('composing', jid);
        await new Promise(r => setTimeout(r, (typeConfig.duration || 5) * 1000));
        await this.bot.client.sock.sendPresenceUpdate('paused', jid);
      }

      // 4. Presence Automation (Recording)
      const recConfig = await this.bot.db.get('automation', 'record:config');
      if (checkActive(recConfig)) {
        await this.bot.client.sock.sendPresenceUpdate('recording', jid);
        await new Promise(r => setTimeout(r, (recConfig.duration || 10) * 1000));
        await this.bot.client.sock.sendPresenceUpdate('paused', jid);
      }
    } catch (e) {
      this.bot.logger.error(`Automation Hub Error: ${e.message}`);
    }
  }
}

export default MessageHandler;
