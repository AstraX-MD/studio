/**
 * @fileOverview Anime poke reaction.
 */
import axios from 'axios';

export default {
  name: "poke",
  category: "anime",
  description: "Poke someone with an anime GIF.",
  usage: "poke <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const mentionText = target ? `@${target.split('@')[0]}` : "themself";
    const sources = ['https://api.waifu.pics/sfw/poke', 'https://nekos.best/api/v2/poke'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const gif = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          video: { url: gif },
          gifPlayback: true,
          caption: `┌──⌈ 👉 POKE ⌋\n┃ @${ctx.sender.split('@')[0]} pokes ${mentionText}!\n└─ 🌌 ${botName}`,
          mentions: target ? [target, ctx.sender] : [ctx.sender]
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to load reaction.\n└────────────────");
  }
};