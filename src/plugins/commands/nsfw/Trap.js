/**
 * @fileOverview Random Trap content.
 */
import axios from 'axios';

export default {
  name: "trap",
  category: "nsfw",
  description: "Get a random NSFW trap image.",
  usage: "trap",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled.\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/trap');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: res.data.url },
        caption: `┌──⌈ 🔞 TRAP ⌋\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Scraper busy.");
    }
  }
};
