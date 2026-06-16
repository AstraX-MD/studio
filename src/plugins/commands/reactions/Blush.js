/**
 * @fileOverview Anime blushing reaction.
 */
import axios from 'axios';

export default {
  name: "blush",
  category: "reactions",
  description: "Show a blushing anime GIF.",
  usage: "blush",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      const res = await axios.get('https://api.waifu.pics/sfw/blush');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 😳 BLUSH ⌋\n┃ @${ctx.sender.split('@')[0]} is blushing!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: [ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Reaction failed.");
    }
  }
};
