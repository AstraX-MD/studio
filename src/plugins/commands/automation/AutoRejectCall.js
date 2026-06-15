/**
 * @fileOverview Automatically reject incoming calls with a professional design.
 */
export default {
  name: "autorejectcall",
  aliases: ["anticall", "rejectcall"],
  category: "automation",
  description: "Set the bot to automatically decline all incoming calls.",
  usage: "autorejectcall <on/off/dm/groups/both>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'call:reject:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (['on', 'both'].includes(input)) config.mode = 'both';
      else if (input === 'off') config.mode = 'off';
      else if (['dm', 'groups'].includes(input)) config.mode = input;
      await ctx.bot.db.set('automation', 'call:reject:config', config);
    }

    const output = `┌──⌈ 📞 CALL REJECT ⌋
┃
┃ Mode: ${config.mode === 'off' ? '❌ OFF' : '✅ ' + config.mode.toUpperCase()}
┃ Action: AUTO-DECLINE
┃ System: ANTI-INTERRUPT
┃
├─⊷ ${prefix}autorejectcall dm
│  └⊷ Reject DM calls only
├─⊷ ${prefix}autorejectcall groups
│  └⊷ Reject group calls
├─⊷ ${prefix}autorejectcall both
│  └⊷ Reject all calls
├─⊷ ${prefix}autorejectcall off
│  └⊷ Allow incoming calls
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
