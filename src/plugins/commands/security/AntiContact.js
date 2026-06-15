/**
 * @fileOverview Block contact cards (vCards) from being sent.
 */
export default {
  name: "anticontact",
  aliases: ["nocontact", "vcardfilter"],
  category: "security",
  description: "Prevent users from sharing contact cards in the group.",
  usage: "anticontact <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `anticontact:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `anticontact:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 👤 ANTI-CONTACT ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}anticontact on
│  └⊷ Block vCards
├─⊷ ${prefix}anticontact off
│  └⊷ Allow vCards
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
