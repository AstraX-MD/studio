/**
 * @fileOverview Random Hentai Image Scraper.
 */
import axios from 'axios';

export default {
  name: "hentai",
  category: "nsfw",
  description: "Get a random high-quality hentai image.",
  usage: "hentai",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled in this group.\n┃ Use !nsfw on to enable.\n└────────────────");

    const fallbacks = [
      'https://api.agatz.xyz/api/hentai',
      'https://api.waifu.pics/nsfw/waifu',
      'https://api.dlow.xyz/api/hentai'
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.url || res.data.result;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ 🔞 HENTAI ⌋\n┃ Status: Collected\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ All hentai routes are busy.");
  }
};
