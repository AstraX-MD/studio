/**
 * @fileOverview High-quality random memes with fallbacks.
 */
import axios from 'axios';

export default {
  name: "meme",
  category: "fun",
  description: "Get a random trending meme from Reddit/Socials.",
  usage: "meme",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    const fallbacks = [
      'https://meme-api.com/gimme',
      'https://api.agatz.xyz/api/meme',
      'https://api.dlow.xyz/api/meme'
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.url || res.data.result || res.data.data;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ 😂 MEME ⌋\n┃ Title: ${res.data.title || 'Trending'}\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ No memes found in the void.\n└────────────────");
  }
};
