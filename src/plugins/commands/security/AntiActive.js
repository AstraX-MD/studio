/**
 * @fileOverview Prevent the bot from showing 'Active' status to users.
 */
export default {
  name: "antiactive",
  aliases: ["stealthactive", "noactive"],
  category: "security",
  description: "Stop the bot from broadcasting 'Active' presence updates.",
  usage: "antiactive <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', 'antiactive:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input === 'on' || input === 'off') {
      config.mode = input;
      await ctx.bot.db.set('security', 'antiactive:config', config);
    }

    const output = `┌──⌈ 👻 ANTI-ACTIVE ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Mode: STEALTH
┃ Effect: HIDE ACTIVITY
┃
├─⊷ ${prefix}antiactive on
│  └⊷ Hide bot activity
├─⊷ ${prefix}antiactive off
│  └⊷ Show bot activity
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
