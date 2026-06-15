/**
 * @fileOverview Anime feed reaction.
 */
import axios from 'axios';

export default {
  name: "feed",
  category: "anime",
  description: "Feed someone with an anime GIF.",
  usage: "feed <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Please tag/reply to feed someone.\n└────────────────");

    const sources = ['https://api.waifu.pics/sfw/feed', 'https://nekos.best/api/v2/feed'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const gif = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          video: { url: gif },
          gifPlayback: true,
          caption: `┌──⌈ 🍕 FEED ⌋\n┃ @${ctx.sender.split('@')[0]} feeds @${target.split('@')[0]}!\n└─ 🌌 ${botName}`,
          mentions: [target, ctx.sender]
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Feeding source failed.\n└────────────────");
  }
};