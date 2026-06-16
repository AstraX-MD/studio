/**
 * @fileOverview Anime smile reaction.
 */
import axios from 'axios';

export default {
  name: "smile",
  category: "reactions",
  description: "Show a beautiful smiling anime GIF.",
  usage: "smile",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      const res = await axios.get('https://api.waifu.pics/sfw/smile');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 😊 SMILE ⌋\n┃ @${ctx.sender.split('@')[0]} is smiling!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: [ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Content unavailable.");
    }
  }
};
