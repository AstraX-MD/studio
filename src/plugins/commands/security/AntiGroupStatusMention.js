/**
 * @fileOverview Prevent users from mentioning 'everyone' via status context.
 */
export default {
  name: "antigroupstatusmention",
  aliases: ["antigrpmention", "nomentionstatus"],
  category: "security",
  description: "Block attempts to notify everyone using mass mention techniques.",
  usage: "antigroupstatusmention <on/off/kick/warn>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antigrpmention:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antigrpmention:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 📢 ANTI-GRP-MENTION ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃ Scope: MASS-TAG PREVENT
┃
├─⊷ ${prefix}antigroupstatusmention on
│  └⊷ Block mass tags
├─⊷ ${prefix}antigroupstatusmention off
│  └⊷ Allow mentions
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
