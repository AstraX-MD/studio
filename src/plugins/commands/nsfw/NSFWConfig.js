/**
 * @fileOverview Administrative toggle for mature content.
 */
export default {
  name: "nsfw",
  aliases: ["setnsfw", "adultmode"],
  category: "nsfw",
  description: "Enable or Disable mature content commands for this group.",
  usage: "nsfw <on/off>",
  permissions: 5, // ADMIN+
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'off') {
      await ctx.bot.db.set('settings', `nsfw_enabled:${ctx.jid}`, mode === 'on');
      
      const output = `┌──⌈ 🔞 NSFW SYSTEM ⌋
┃
┃ Status: ${mode === 'on' ? '✅ ENABLED' : '❌ DISABLED'}
┃ Group: ${ctx.jid.split('@')[0]}
┃ Warning: MATURE CONTENT
┃
└────────────────
  © ${botName.toUpperCase()}`;
      return ctx.reply(output);
    }

    const current = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;
    ctx.reply(`┌──⌈ ⚙️ NSFW CONFIG ⌋\n┃\n┃ Current: ${current ? 'ON' : 'OFF'}\n┃ Usage: !nsfw on/off\n└────────────────`);
  }
};
