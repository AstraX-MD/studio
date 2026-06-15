/**
 * @fileOverview Random NSFW Neko Scraper.
 */
import axios from 'axios';

export default {
  name: "nsfwneko",
  aliases: ["nneko"],
  category: "nsfw",
  description: "Get a random NSFW neko image.",
  usage: "nneko",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    if (!isEnabled) return ctx.reply("┌──⌈ 🔒 RESTRICTED ⌋\n┃ NSFW is disabled.\n└────────────────");

    const fallbacks = [
      'https://api.agatz.xyz/api/neko_nsfw',
      'https://api.waifu.pics/nsfw/neko'
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ 🔞 NSFW NEKO ⌋\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ No nekos found.");
  }
};
