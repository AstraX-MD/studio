/**
 * @fileOverview Block location sharing.
 */
export default {
  name: "antilocation",
  aliases: ["noloc", "blocklocation"],
  category: "security",
  description: "Prevent users from sharing GPS locations in the group.",
  usage: "antilocation <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antilocation:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antilocation:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 📍 ANTI-LOCATION ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antilocation on
│  └⊷ Block GPS sharing
├─⊷ ${prefix}antilocation off
│  └⊷ Allow locations
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
