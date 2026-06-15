/**
 * @fileOverview Block video files.
 */
export default {
  name: "antivideo",
  aliases: ["novideo", "blockvideo"],
  category: "security",
  description: "Automatically detect and remove video files in the chat.",
  usage: "antivideo <on/off/kick/warn/delete>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antivideo:${ctx.jid}`)) || { mode: 'off', action: 'delete' };
    const input = args[0]?.toLowerCase();

    if (input) {
      if (input === 'on') config.mode = 'on';
      else if (input === 'off') config.mode = 'off';
      else if (['kick', 'warn', 'delete'].includes(input)) config.action = input;
      
      await ctx.bot.db.set('security', `antivideo:${ctx.jid}`, config);
    }

    const output = `┌──⌈ 🎥 ANTI-VIDEO ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ARMED'}
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antivideo on
│  └⊷ Block all videos
├─⊷ ${prefix}antivideo off
│  └⊷ Allow videos
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
