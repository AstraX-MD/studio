/**
 * @fileOverview Prevent non-admins from mass mentioning members.
 */
export default {
  name: "antitagall",
  aliases: ["antimention", "nomassmention"],
  category: "security",
  description: "Block or kick users who mass mention group members.",
  usage: "antitagall <on/off/kick/warn>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antitagall:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antitagall:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 📢 ANTI-TAGALL ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Limit: MAX 10 MENTIONS
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antitagall on
│  └⊷ Block mass mentions
├─⊷ ${prefix}antitagall kick
│  └⊷ Kick mass taggers
├─⊷ ${prefix}antitagall off
│  └⊷ Allow tagging
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
