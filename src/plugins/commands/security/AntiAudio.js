/**
 * @fileOverview Block audio files from being sent in groups.
 */
export default {
  name: "antiaudio",
  aliases: ["noaudio", "blockaudio"],
  category: "security",
  description: "Automatically detect and remove audio files in the chat.",
  usage: "antiaudio <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antiaudio:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antiaudio:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 🎵 ANTI-AUDIO ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃ Scope: CURRENT GROUP
┃
├─⊷ ${prefix}antiaudio on
│  └⊷ Enable audio filter
├─⊷ ${prefix}antiaudio action kick
│  └⊷ Remove offenders
├─⊷ ${prefix}antiaudio off
│  └⊷ Allow audio files
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
