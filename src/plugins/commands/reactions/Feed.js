/**
 * @fileOverview Anime feeding reaction.
 */
import axios from 'axios';

export default {
  name: "feed",
  category: "reactions",
  description: "Feed someone with a delicious anime GIF.",
  usage: "feed <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag a user to feed them!\n└────────────────");

    try {
      const res = await axios.get('https://api.waifu.pics/sfw/feed');
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.url },
        gifPlayback: true,
        caption: `┌──⌈ 🍕 FEED ⌋\n┃ @${ctx.sender.split('@')[0]} feeds @${target.split('@')[0]}!\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: [target, ctx.sender]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Archives empty.");
    }
  }
};
