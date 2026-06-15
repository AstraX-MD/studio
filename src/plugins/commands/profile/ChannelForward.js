/**
 * @fileOverview Toggle the "Forwarded from Channel" look for all bot responses.
 */
export default {
  name: "channelforward",
  aliases: ["cf", "cloak"],
  category: "profile",
  description: "Make bot replies appear as forwarded messages from official channel.",
  usage: "channelforward <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'off') {
      await ctx.bot.db.set('core', 'forward_channel', mode === 'on');
    }

    const current = await ctx.bot.db.get('core', 'forward_channel') || false;

    const output = `┌──⌈ 📢 CHANNEL CLOAK ⌋
┃
┃ Status: ${current ? '✅ ENABLED' : '❌ DISABLED'}
┃ Source: ASTRAX UPDATES
┃ Effect: GLOBAL FORWARD
┃
├─⊷ On: All msgs appear forwarded
├─⊷ Off: Normal messaging mode
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
