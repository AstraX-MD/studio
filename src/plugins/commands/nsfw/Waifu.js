/**
 * @fileOverview Random NSFW Waifu Scraper.
 */
import axios from 'axios';

export default {
  name: "nsfwwaifu",
  aliases: ["nwaifu"],
  category: "nsfw",
  description: "Get a random NSFW waifu image.",
  usage: "nwaifu",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled.\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/waifu');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: res.data.url },
        caption: `┌──⌈ 🔞 NSFW WAIFU ⌋\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch image.");
    }
  }
};
