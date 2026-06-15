/**
 * @fileOverview Filter emoji content in messages.
 */
export default {
  name: "antiemoji",
  aliases: ["ae", "noemoji"],
  category: "security",
  description: "Restrict or warn for emoji usage in group messages.",
  usage: "antiemoji <on/off/delete/warn>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antiemoji:${ctx.jid}`)) || { mode: 'off', action: 'warn' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['delete', 'warn'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antiemoji:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 😀 ANTI-EMOJI ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Action: ${config.action.toUpperCase()}
┃ Limit: MAX 3 PER MSG
┃
├─⊷ ${prefix}antiemoji on
├─⊷ ${prefix}antiemoji warn
├─⊷ ${prefix}antiemoji off
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
