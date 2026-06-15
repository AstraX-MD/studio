/**
 * @fileOverview Configure link protection with automated punishments.
 */
export default {
  name: "antilink",
  aliases: ["al", "linkfilter"],
  category: "security",
  description: "Automatically detect and punish users sending group links.",
  usage: "antilink <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antilink:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antilink:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 🔗 ANTI-LINK ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃ Scope: CURRENT GROUP
┃
├─⊷ ${prefix}antilink on
│  └⊷ Enable link filter
├─⊷ ${prefix}antilink action kick
│  └⊷ Remove offenders
├─⊷ ${prefix}antilink action warn
│  └⊷ Issue warning strike
├─⊷ ${prefix}antilink action delete
│  └⊷ Only remove message
├─⊷ ${prefix}antilink off
│  └⊷ Disable filter
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
