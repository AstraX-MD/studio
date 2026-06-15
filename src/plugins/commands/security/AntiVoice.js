/**
 * @fileOverview Block voice notes (PTT).
 */
export default {
  name: "antivoicemail",
  aliases: ["novoice", "blockvoice"],
  category: "security",
  description: "Automatically detect and remove voice notes (PTT).",
  usage: "antivoicemail <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antivoicemail:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antivoicemail:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 🎙️ ANTI-VOICE ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antivoicemail on
│  └⊷ Block voice notes
├─⊷ ${prefix}antivoicemail off
│  └⊷ Allow voice notes
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
