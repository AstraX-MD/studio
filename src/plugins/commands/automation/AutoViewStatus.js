/**
 * @fileOverview Toggle automatic status viewing and logging.
 */
export default {
  name: "autoviewstatus",
  aliases: ["autostatus", "readstatus"],
  category: "automation",
  description: "Automatically view and log WhatsApp statuses.",
  usage: "autoviewstatus <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'status:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input === 'on' || input === 'off') {
      config.mode = input;
      await ctx.bot.db.set('automation', 'status:config', config);
    }

    const output = `╭─⌈ 👁️ *AUTO-STATUS* ⌋
│
│ Mode: ${config.mode === 'on' ? '✅ ACTIVE' : '❌ INACTIVE'}
│ Action: Auto View & Log
│ Scope: All Contacts
│
├─⊷ *${prefix}autoviewstatus on*
│  └⊷ View all incoming statuses
├─⊷ *${prefix}autoviewstatus off*
│  └⊷ Disable status viewing
│
╰⊷ 🌌 *Powered by ${botName.toUpperCase()}*`;

    ctx.reply(output);
  }
};
