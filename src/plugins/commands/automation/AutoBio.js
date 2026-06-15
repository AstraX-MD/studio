/**
 * @fileOverview Automatically update the bot's bio with live statistics.
 */
export default {
  name: "autobio",
  aliases: ["bio", "livebio"],
  category: "automation",
  description: "Continuously update the bot's About info with system status.",
  usage: "autobio <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'bio:update:config')) || { mode: 'off' };
    const input = args[0]?.toLowerCase();

    if (input === 'on' || input === 'off') {
      config.mode = input;
      await ctx.bot.db.set('automation', 'bio:update:config', config);
    }

    const output = `┌──⌈ 📝 LIVE BIO ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ON'}
┃ Update: EVERY 5 MIN
┃ Content: UPTIME + STATS
┃
├─⊷ ${prefix}autobio on
│  └⊷ Start bio updates
├─⊷ ${prefix}autobio off
│  └⊷ Stop updates
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
