/**
 * @fileOverview Prevent the bot from showing 'Online' status.
 */
export default {
  name: "antionline",
  aliases: ["hideonline", "incognito"],
  category: "security",
  description: "Force the bot to remain offline even while active.",
  usage: "antionline <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', 'antionline:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input === 'on' || input === 'off') {
      config.mode = input;
      await ctx.bot.db.set('security', 'antionline:config', config);
      
      // Update presence immediately
      if (input === 'on') await ctx.sock.sendPresenceUpdate('unavailable');
    }

    const output = `┌──⌈ 🕶️ ANTI-ONLINE ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Mode: INCOGNITO
┃ Visibility: HIDDEN
┃
├─⊷ ${prefix}antionline on
│  └⊷ Remain 'Offline'
├─⊷ ${prefix}antionline off
│  └⊷ Follow presence rules
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
