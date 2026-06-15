/**
 * @fileOverview Block documents and large files.
 */
export default {
  name: "antidocument",
  aliases: ["nodoc", "blockfiles"],
  category: "security",
  description: "Prevent users from sharing documents and large files.",
  usage: "antidocument <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antidocument:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antidocument:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 📂 ANTI-DOCUMENT ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antidocument on
│  └⊷ Block files/PDFs
├─⊷ ${prefix}antidocument off
│  └⊷ Allow files
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
