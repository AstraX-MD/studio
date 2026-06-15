/**
 * @fileOverview Block forwarded messages.
 */
export default {
  name: "antiforward",
  aliases: ["noforward", "blockfw"],
  category: "security",
  description: "Automatically detect and remove forwarded messages.",
  usage: "antiforward <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antiforward:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antiforward:${ctx.jid}`, config);
    }

    const output = `┌──⌈ ⏩ ANTI-FORWARD ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antiforward on
│  └⊷ Block all forwards
├─⊷ ${prefix}antiforward off
│  └⊷ Allow forwards
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
