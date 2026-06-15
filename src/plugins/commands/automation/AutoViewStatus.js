/**
 * @fileOverview Toggle automatic status viewing with a professional boxed design.
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

    const output = `┌──⌈ 👁️ STATUS WATCH ⌋
┃
┃ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ON'}
┃ Action: AUTO-VIEW
┃ Target: ALL CONTACTS
┃
├─⊷ ${prefix}autoviewstatus on
│  └⊷ Enable auto-view
├─⊷ ${prefix}autoviewstatus off
│  └⊷ Disable auto-view
┃
┃ (Status logs available in 
┃ Terminal Subsystem)
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
