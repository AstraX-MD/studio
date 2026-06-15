/**
 * @fileOverview Detect and remove other automated accounts.
 */
export default {
  name: "antibot",
  aliases: ["ab", "nobots"],
  category: "security",
  description: "Detect and kick other bots from the group.",
  usage: "antibot <on/off>",
  permissions: 9,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antibot:${ctx.jid}`)) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input === 'on' || input === 'off') {
      config.mode = input;
      await ctx.bot.db.set('security', `antibot:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 🤖 ANTI-BOT ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Action: AUTO-KICK
┃ Detect: TOKEN-SIGNATURE
┃
├─⊷ ${prefix}antibot on
│  └⊷ Enable detection
├─⊷ ${prefix}antibot off
│  └⊷ Disable detection
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
