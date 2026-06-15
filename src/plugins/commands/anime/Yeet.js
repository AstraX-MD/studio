/**
 * @fileOverview Anime yeet reaction.
 */
import axios from 'axios';

export default {
  name: "yeet",
  category: "anime",
  description: "Yeet someone with an anime GIF.",
  usage: "yeet <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mentionText = target ? `@${target.split('@')[0]}` : "themself";
    const sources = ['https://api.waifu.pics/sfw/yeet', 'https://nekos.best/api/v2/yeet'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const gif = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          video: { url: gif },
          gifPlayback: true,
          caption: `┌──⌈ 🚀 YEET ⌋\n┃ @${ctx.sender.split('@')[0]} yeeted ${mentionText}!\n└─ 🌌 ${botName}`,
          mentions: target ? [target, ctx.sender] : [ctx.sender]
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Yeet source failed.\n└────────────────");
  }
};