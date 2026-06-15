/**
 * @fileOverview Block group polls.
 */
export default {
  name: "antipoll",
  aliases: ["nopoll", "blockpoll"],
  category: "security",
  description: "Prevent users from creating polls in the group.",
  usage: "antipoll <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antipoll:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antipoll:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 📊 ANTI-POLL ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antipoll on
│  └⊷ Block polls
├─⊷ ${prefix}antipoll off
│  └⊷ Allow polls
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
