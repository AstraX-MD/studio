/**
 * @fileOverview Block sticker spam with configurable actions.
 */
export default {
  name: "antisticker",
  aliases: ["as", "nosticker"],
  category: "security",
  description: "Prevent users from sending stickers in the group.",
  usage: "antisticker <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antisticker:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antisticker:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 🖼️ ANTI-STICKER ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃ Scope: CURRENT GROUP
┃
├─⊷ ${prefix}antisticker on
│  └⊷ Block all stickers
├─⊷ ${prefix}antisticker kick
│  └⊷ Remove offenders
├─⊷ ${prefix}antisticker off
│  └⊷ Allow stickers
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
